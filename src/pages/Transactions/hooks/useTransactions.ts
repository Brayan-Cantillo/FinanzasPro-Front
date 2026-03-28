import { useEffect, useState, type FormEvent } from 'react';
import {
  transactionService,
  type Transaction,
  type CreateTransactionPayload,
} from '../../../services/transactionService';
import { exportToExcel } from '../../../utils/exportExcel'; // Utilidad para exportar a Excel
import { EMPTY_FORM } from '../utils'; // Formulario vacío por defecto

/**
 * Hook personalizado que encapsula toda la lógica de la página de Transacciones.
 * Maneja el CRUD completo de transacciones:
 * - Listar todas las transacciones
 * - Crear una nueva transacción
 * - Editar una transacción existente
 * - Eliminar una transacción
 * - Exportar transacciones a Excel
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Lista de transacciones del usuario
  const [loading, setLoading] = useState(true);                         // Indica si se están cargando las transacciones
  const [error, setError] = useState('');                                // Error general (carga, eliminación)
  const [formError, setFormError] = useState('');                        // Error del formulario (validación, guardado)
  const [showForm, setShowForm] = useState(false);                       // Controla visibilidad del formulario
  const [editingId, setEditingId] = useState<number | null>(null);       // ID de la transacción que se está editando (null = creando)
  const [form, setForm] = useState<CreateTransactionPayload>(EMPTY_FORM); // Estado del formulario
  const [submitting, setSubmitting] = useState(false);                     // Indica si se está guardando

  /**
   * Carga todas las transacciones del usuario desde el servidor.
   */
  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await transactionService.getAll();
      setTransactions(res.data);
    } catch {
      setError('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  // Carga las transacciones al montar el componente
  useEffect(() => {
    fetchTransactions();
  }, []);

  /**
   * Resetea el formulario a su estado inicial y oculta el formulario.
   */
  const resetForm = () => {
    setForm(EMPTY_FORM);       // Limpia los campos del formulario
    setEditingId(null);         // Sale del modo edición
    setShowForm(false);         // Oculta el formulario
    setFormError('');            // Limpia errores del formulario
  };

  /**
   * Prepara el formulario para editar una transacción existente.
   * Rellena los campos con los datos de la transacción seleccionada.
   */
  const handleEdit = (t: Transaction) => {
    setForm({
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: t.date.split('T')[0], // Extrae solo la parte de la fecha (YYYY-MM-DD)
    });
    setEditingId(t.id);  // Guarda el ID para saber que estamos editando
    setShowForm(true);    // Muestra el formulario
  };

  /**
   * Elimina una transacción tras confirmación del usuario.
   * Actualiza la lista local sin necesidad de recargar del servidor.
   */
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) return; // Pide confirmación
    try {
      await transactionService.delete(id);                                // Elimina en el servidor
      setTransactions((prev) => prev.filter((t) => t.id !== id));         // Elimina de la lista local
    } catch {
      setError('Error al eliminar la transacción');
    }
  };

  /**
   * Maneja el envío del formulario (crear o actualizar transacción).
   * Valida los campos obligatorios y el monto antes de enviar al servidor.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Previene recarga de página

    // Validación: todos los campos son obligatorios
    if (!form.category || !form.description || !form.amount || !form.date) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    // Validación: el monto debe ser positivo
    if (form.amount <= 0) {
      setFormError('El monto debe ser mayor a 0');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      if (editingId) {
        // Modo edición: actualiza la transacción existente
        const res = await transactionService.update(editingId, form);
        setTransactions((prev) => prev.map((t) => (t.id === editingId ? res.data : t))); // Reemplaza en la lista local
      } else {
        // Modo creación: crea una nueva transacción
        const res = await transactionService.create(form);
        setTransactions((prev) => [res.data, ...prev]); // Agrega al inicio de la lista
      }
      resetForm(); // Limpia y oculta el formulario tras éxito
    } catch {
      setFormError('Error al guardar la transacción');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Exporta todas las transacciones a un archivo Excel.
   * Transforma los datos al formato legible antes de exportar.
   */
  const handleExport = () => {
    exportToExcel(
      transactions.map((t) => ({
        Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',         // Traduce el tipo
        Descripción: t.description,
        Categoría: t.category,
        Fecha: new Date(t.date).toLocaleDateString('es-CO'),      // Formatea la fecha
        Monto: t.amount,
      })),
      'transacciones', // Nombre del archivo
    );
  };

  // Retorna todos los estados y funciones necesarios para la vista
  return {
    transactions,
    loading,
    error,
    formError,
    showForm,
    editingId,
    form,
    submitting,
    setForm,
    setShowForm,
    resetForm,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleExport,
    fetchTransactions,
  };
};
