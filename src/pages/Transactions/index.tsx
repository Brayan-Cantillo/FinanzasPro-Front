// Componentes reutilizables
import LoadingSpinner from '../../components/LoadingSpinner';        // Spinner de carga
import ErrorAlert from '../../components/ErrorAlert';                // Alerta de error
import { formatCurrency } from '../../utils/format-currency.utils'; // Formateador de moneda COP
import { useTransactions } from './hooks';                           // Hook con la lógica de transacciones
import { TRANSACTION_CATEGORIES } from './utils';                    // Lista de categorías disponibles

/**
 * Página de gestión de Transacciones.
 * Permite al usuario:
 * - Ver todas sus transacciones en una tabla
 * - Crear nuevas transacciones (ingresos o gastos)
 * - Editar transacciones existentes
 * - Eliminar transacciones
 * - Exportar las transacciones a un archivo Excel
 */
export default function Transactions() {
  // Desestructura todos los estados y funciones del hook de transacciones
  const {
    transactions,       // Lista de transacciones
    loading,            // Estado de carga
    error,              // Error general
    formError,          // Error del formulario
    showForm,           // Muestra/oculta el formulario
    editingId,          // ID de la transacción en edición
    form,               // Datos del formulario
    submitting,         // Indica si se está guardando
    setForm,            // Actualiza el formulario
    setShowForm,        // Muestra el formulario
    resetForm,          // Resetea y oculta el formulario
    handleEdit,         // Inicia la edición de una transacción
    handleDelete,       // Elimina una transacción
    handleSubmit,       // Envía el formulario (crear/editar)
    handleExport,       // Exporta a Excel
    fetchTransactions,  // Recarga las transacciones
  } = useTransactions();

  return (
    <div>
      {/* Encabezado con título y botones de acción */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
        <div className="flex gap-2">
          {/* Botón de exportar Excel: solo visible si hay transacciones */}
          {transactions.length > 0 && (
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer"
            >
              Exportar Excel
            </button>
          )}
          {/* Botón para mostrar/ocultar el formulario de nueva transacción */}
          <button
            onClick={() => {
              if (showForm) resetForm();    // Si el formulario está abierto, lo cierra y resetea
              else setShowForm(true);        // Si está cerrado, lo abre
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
          >
            {showForm ? 'Cancelar' : '+ Nueva transacción'}
          </button>
        </div>
      </div>

      {/* Formulario de crear/editar transacción: solo visible cuando showForm es true */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Título dinámico: "Editar" o "Nueva" según el modo */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Editar transacción' : 'Nueva transacción'}
          </h2>
          {/* Error del formulario */}
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              {formError}
            </div>
          )}
          {/* Formulario con grid de 2 columnas en desktop */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selector de tipo: Ingreso o Gasto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>
            {/* Campo de monto numérico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="0"
                min="0"
                step="any"
              />
            </div>
            {/* Selector de categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Selecciona una categoría</option>
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Campo de fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            {/* Campo de descripción: ocupa 2 columnas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Descripción de la transacción"
              />
            </div>
            {/* Botón de envío: texto dinámico según modo crear/editar */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear transacción'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerta de error general con opción de reintentar */}
      {error && <ErrorAlert message={error} onRetry={fetchTransactions} />}

      {/* Contenido principal: spinner, mensaje vacío o tabla de transacciones */}
      {loading ? (
        <LoadingSpinner />
      ) : transactions.length === 0 ? (
        // Mensaje cuando no hay transacciones registradas
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No hay transacciones aún</p>
          <p className="text-sm">Crea tu primera transacción para empezar</p>
        </div>
      ) : (
        // Tabla de transacciones
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            {/* Encabezados de la tabla */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            {/* Filas de transacciones */}
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  {/* Badge de tipo: verde para ingreso, rojo para gasto */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{t.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.category}</td>
                  {/* Fecha formateada al estilo colombiano */}
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('es-CO')}</td>
                  {/* Monto con signo + o - y color según tipo */}
                  <td
                    className={`px-6 py-4 text-sm font-semibold text-right ${
                      t.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  {/* Botones de editar y eliminar */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
