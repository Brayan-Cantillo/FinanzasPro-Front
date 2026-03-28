// Componentes reutilizables
import LoadingSpinner from '../../components/LoadingSpinner';        // Spinner de carga
import ErrorAlert from '../../components/ErrorAlert';                // Alerta de error
import { formatCurrency } from '../../utils/format-currency.utils'; // Formateador de moneda COP
import { useProfile } from './hooks';                                // Hook con la lógica del perfil

/**
 * Página de Perfil del usuario.
 * Muestra la información personal del usuario y su resumen financiero.
 * Permite editar el nombre y el salario mensual.
 * Incluye indicadores visuales como:
 * - Tarjetas de ingresos, gastos, balance y tasa de ahorro
 * - Barra de progreso de gastos vs salario
 */
export default function Profile() {
  // Desestructura todos los estados, funciones e indicadores del hook
  const {
    profile,               // Datos del perfil del usuario
    loading,               // Estado de carga
    error,                 // Error al cargar
    editing,               // Modo edición activo
    saving,                // Guardando cambios
    saveMsg,               // Mensaje de éxito/error al guardar
    form,                  // Datos del formulario de edición
    setForm,               // Actualiza el formulario
    setEditing,            // Activa modo edición
    handleSave,            // Guarda los cambios
    handleCancelEdit,      // Cancela la edición
    fetchData,             // Recarga los datos
    salary,                // Salario del usuario
    income,                // Total ingresos
    expenses,              // Total gastos
    balance,               // Balance (ingresos - gastos)
    savingsRate,           // Tasa de ahorro (%)
    expenseToSalaryRatio,  // Ratio gastos/salario (%)
  } = useProfile();

  // Muestra spinner mientras se cargan los datos
  if (loading) return <LoadingSpinner />;
  // Muestra alerta de error con opción de reintentar
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;
  // Si no hay perfil, no renderiza nada
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      {/* Mensaje de éxito o error al guardar cambios */}
      {saveMsg && (
        <div className={`rounded-lg px-4 py-3 text-sm ${saveMsg.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {saveMsg}
        </div>
      )}

      {/* Tarjeta de Perfil del usuario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          {/* Avatar con la inicial del nombre y datos básicos */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
          {/* Botón "Editar perfil": solo visible cuando no está en modo edición */}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
            >
              Editar perfil
            </button>
          )}
        </div>

        {/* Formulario de edición o vista de datos según el modo */}
        {editing ? (
          // Modo edición: formulario para cambiar nombre y salario
          <form onSubmit={handleSave} className="border-t border-gray-200 pt-6 space-y-4">
            {/* Campo nombre (editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            {/* Campo email (deshabilitado, solo lectura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
            {/* Campo salario mensual (editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salario mensual</label>
              <input
                type="number"
                value={form.salary || ''}
                onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 3000000"
                min="0"
                step="any"
              />
            </div>
            {/* Botones de guardar y cancelar */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          // Modo visualización: muestra los datos del perfil en formato de lectura
          <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
              <p className="text-gray-900">{profile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Salario mensual</label>
              <p className="text-gray-900 font-semibold">{salary > 0 ? formatCurrency(salary) : 'No registrado'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta de Resumen Financiero */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen financiero</h2>

        {/* Tarjetas de indicadores: Ingresos, Gastos, Balance y Tasa de Ahorro */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Tarjeta de Ingresos */}
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-green-600 font-medium mb-1">Ingresos</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(income)}</p>
          </div>
          {/* Tarjeta de Gastos */}
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-xs text-red-600 font-medium mb-1">Gastos</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(expenses)}</p>
          </div>
          {/* Tarjeta de Balance: color dinámico según sea positivo o negativo */}
          <div className={`rounded-lg p-4 text-center ${balance >= 0 ? 'bg-indigo-50' : 'bg-red-50'}`}>
            <p className={`text-xs font-medium mb-1 ${balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>Balance</p>
            <p className={`text-lg font-bold ${balance >= 0 ? 'text-indigo-700' : 'text-red-700'}`}>{formatCurrency(balance)}</p>
          </div>
          {/* Tarjeta de Tasa de Ahorro */}
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-xs text-yellow-600 font-medium mb-1">Tasa de ahorro</p>
            <p className="text-lg font-bold text-yellow-700">{savingsRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Barra de progreso: Gastos vs Salario (solo visible si tiene salario registrado) */}
        {salary > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Gastos vs Salario</span>
              <span className="font-medium text-gray-800">{Math.round(expenseToSalaryRatio)}%</span>
            </div>
            {/* Barra de progreso con color dinámico: verde (<50%), amarillo (50-80%), rojo (>80%) */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${expenseToSalaryRatio > 80 ? 'bg-red-500' : expenseToSalaryRatio > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(expenseToSalaryRatio, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
