import { useEffect, useState, type FormEvent } from 'react';
import {
  creditService,
  type CreditSimulation,
  type PaymentPlan,
  type SimulatePayload,
} from '../../../services/creditService';
import { exportToExcel } from '../../../utils/exportExcel'; // Utilidad para exportar a Excel

/**
 * Hook personalizado que encapsula toda la lógica del Simulador de Crédito.
 * Maneja:
 * - Simulación de nuevos créditos (cálculo de cuota mensual)
 * - Historial de simulaciones realizadas
 * - "Tomar" un crédito (marcarlo como aceptado)
 * - Visualización del plan de pagos (tabla de amortización)
 * - Exportación a Excel de simulaciones y planes de pago
 */
export const useCreditSimulator = () => {
  const [simulations, setSimulations] = useState<CreditSimulation[]>([]); // Historial de simulaciones
  const [loading, setLoading] = useState(true);                            // Estado de carga del historial
  const [error, setError] = useState('');                                   // Error general
  const [formError, setFormError] = useState('');                           // Error del formulario de simulación
  const [submitting, setSubmitting] = useState(false);                      // Indica si se está simulando
  const [result, setResult] = useState<CreditSimulation | null>(null);     // Resultado de la última simulación
  const [form, setForm] = useState<SimulatePayload>({                      // Estado del formulario de simulación
    amount: 0,          // Monto del crédito
    interestRate: 0,    // Tasa de interés anual
    months: 0,          // Plazo en meses
  });
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null); // Plan de pagos del modal
  const [loadingPlan, setLoadingPlan] = useState(false);                     // Cargando el plan de pagos

  /**
   * Carga todas las simulaciones previas del usuario desde el servidor.
   */
  const fetchSimulations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await creditService.getAll();
      setSimulations(res.data);
    } catch {
      setError('Error al cargar las simulaciones');
    } finally {
      setLoading(false);
    }
  };

  // Carga las simulaciones al montar el componente
  useEffect(() => {
    fetchSimulations();
  }, []);

  /**
   * Maneja el envío del formulario de simulación.
   * Valida los campos, envía al servidor y muestra el resultado.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Previene recarga de página

    // Validación: todos los campos son obligatorios
    if (!form.amount || !form.interestRate || !form.months) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    // Validación: todos los valores deben ser positivos
    if (form.amount <= 0 || form.interestRate <= 0 || form.months <= 0) {
      setFormError('Todos los valores deben ser mayores a 0');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      const res = await creditService.simulate(form);            // Envía los datos al servidor para calcular
      setResult(res.data);                                        // Guarda el resultado para mostrarlo
      setSimulations((prev) => [res.data, ...prev]);             // Agrega al inicio del historial
    } catch {
      setFormError('Error al simular el crédito');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Marca una simulación como "tomada" (el usuario acepta el crédito).
   * Requiere confirmación del usuario antes de proceder.
   */
  const handleTake = async (id: number) => {
    if (!confirm('¿Deseas tomar este crédito?')) return; // Pide confirmación
    try {
      const res = await creditService.take(id);                              // Marca como tomado en el servidor
      setSimulations((prev) => prev.map((s) => (s.id === id ? res.data : s))); // Actualiza en la lista local
    } catch {
      setError('Error al tomar el crédito');
    }
  };

  /**
   * Carga y muestra el plan de pagos (tabla de amortización) de una simulación.
   * Abre el modal con los detalles mes a mes.
   */
  const handleViewPlan = async (id: number) => {
    setLoadingPlan(true);
    try {
      const res = await creditService.getPaymentPlan(id); // Obtiene la tabla de amortización
      setPaymentPlan(res.data);                             // Guarda los datos para mostrar en el modal
    } catch {
      setError('Error al cargar el plan de pagos');
    } finally {
      setLoadingPlan(false);
    }
  };

  /**
   * Cierra el modal del plan de pagos.
   */
  const handleClosePlan = () => {
    setPaymentPlan(null);
  };

  /**
   * Exporta el plan de pagos actual a un archivo Excel.
   * Incluye: mes, cuota, capital, interés y saldo.
   */
  const handleExportPlan = () => {
    if (!paymentPlan) return;
    exportToExcel(
      paymentPlan.amortizationTable.map((r) => ({
        Mes: r.month,
        Cuota: r.payment,
        Capital: r.principal,
        Interés: r.interest,
        Saldo: r.balance,
      })),
      `plan_pagos_${paymentPlan.id}`, // Nombre del archivo con el ID de la simulación
    );
  };

  /**
   * Exporta el historial de simulaciones a un archivo Excel.
   */
  const handleExport = () => {
    exportToExcel(
      simulations.map((s) => ({
        Monto: s.amount,
        'Interés (%)': s.interestRate,
        'Plazo (meses)': s.months,
        'Cuota mensual': s.monthlyPayment,
        Estado: s.isTaken ? 'Tomado' : 'Simulado',
      })),
      'simulaciones_credito', // Nombre del archivo
    );
  };

  // Retorna todos los estados y funciones para la vista
  return {
    simulations,
    loading,
    error,
    formError,
    submitting,
    result,
    form,
    setForm,
    handleSubmit,
    handleTake,
    handleExport,
    handleViewPlan,
    handleClosePlan,
    handleExportPlan,
    paymentPlan,
    loadingPlan,
    fetchSimulations,
  };
};
