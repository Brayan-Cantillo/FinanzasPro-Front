import { useEffect, useState, type FormEvent } from 'react';
import { userService } from '../../../services/userService';       // Servicio de usuario (perfil)
import { metricsService } from '../../../services/metricsService'; // Servicio de métricas financieras
import { useAuth } from '../../../context/AuthContext';            // Contexto de autenticación
import type { UserProfile } from '../../../services/userService';
import type { MetricsSummary } from '../../../services/metricsService';
import type { ProfileForm } from '../types';

/**
 * Hook personalizado que encapsula toda la lógica de la página de Perfil.
 * Maneja:
 * - Carga del perfil del usuario y sus métricas financieras
 * - Edición del perfil (nombre y salario)
 * - Cálculo de indicadores financieros (tasa de ahorro, ratio gastos/salario)
 */
export const useProfile = () => {
  const { updateUser } = useAuth();  // Función para actualizar el usuario en el contexto global

  // Estados principales
  const [profile, setProfile] = useState<UserProfile | null>(null);    // Datos del perfil del usuario
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null); // Métricas financieras del usuario
  const [loading, setLoading] = useState(true);                         // Estado de carga
  const [error, setError] = useState('');                                // Mensaje de error
  const [editing, setEditing] = useState(false);                         // Modo edición activo/inactivo
  const [saving, setSaving] = useState(false);                           // Indica si se está guardando
  const [saveMsg, setSaveMsg] = useState('');                            // Mensaje de éxito o error al guardar
  const [form, setForm] = useState<ProfileForm>({ name: '', email: '', salary: 0 }); // Estado del formulario

  /**
   * Carga el perfil del usuario y las métricas financieras en paralelo.
   * Se ejecuta al montar el componente y al reintentar tras un error.
   */
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Ejecuta ambas peticiones en paralelo para mayor eficiencia
      const [profileRes, metricsRes] = await Promise.all([
        userService.getProfile(),       // Obtiene datos del perfil
        metricsService.getSummary(),     // Obtiene resumen financiero general
      ]);
      setProfile(profileRes.data);
      setMetrics(metricsRes.data);
      // Rellena el formulario con los datos actuales del perfil
      setForm({
        name: profileRes.data.name,
        email: profileRes.data.email,
        salary: profileRes.data.salary ?? 0,
      });
    } catch {
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Carga los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Guarda los cambios del perfil editado.
   * Envía nombre y salario al servidor y actualiza el contexto global de autenticación.
   */
  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); // Previene recarga de página

    // Validación: nombre y email son obligatorios
    if (!form.name || !form.email) {
      setSaveMsg('Nombre y email son obligatorios');
      return;
    }

    setSaving(true);
    setSaveMsg('');
    try {
      // Envía solo nombre y salario al servidor (el email no es editable)
      const res = await userService.updateProfile({
        name: form.name,
        salary: form.salary,
      });
      setProfile(res.data);  // Actualiza el perfil local
      // Actualiza el usuario en el contexto global (Navbar y demás componentes)
      updateUser({ name: res.data.name, email: res.data.email, salary: res.data.salary });
      setEditing(false);  // Sale del modo edición
      setSaveMsg('Perfil actualizado correctamente');
      // Oculta el mensaje de éxito después de 3 segundos
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancela la edición y restaura los valores originales del formulario.
   */
  const handleCancelEdit = () => {
    setEditing(false);
    if (profile) {
      setForm({ name: profile.name, email: profile.email, salary: profile.salary ?? 0 });
    }
  };

  // Cálculos de indicadores financieros derivados de las métricas y el perfil
  const salary = profile?.salary ?? 0;                                            // Salario del usuario
  const expenses = metrics?.totalExpenses ?? 0;                                    // Total de gastos
  const income = metrics?.totalIncome ?? 0;                                        // Total de ingresos
  const balance = metrics?.balance ?? 0;                                           // Balance (ingresos - gastos)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;     // Tasa de ahorro en %
  const expenseToSalaryRatio = salary > 0 ? (expenses / salary) * 100 : 0;       // Ratio gastos/salario en %

  // Retorna todos los estados, funciones e indicadores para la vista
  return {
    profile,
    loading,
    error,
    editing,
    saving,
    saveMsg,
    form,
    setForm,
    setEditing,
    handleSave,
    handleCancelEdit,
    fetchData,
    salary,
    income,
    expenses,
    balance,
    savingsRate,
    expenseToSalaryRatio,
  };
};
