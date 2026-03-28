// Componentes reutilizables
import LoadingSpinner from '../../components/LoadingSpinner';        // Spinner de carga
import ErrorAlert from '../../components/ErrorAlert';                // Alerta de error
import { formatCurrency } from '../../utils/format-currency.utils'; // Formateador de moneda COP
import { useCreditSimulator } from './hooks';                        // Hook con la lógica del simulador
import PaymentPlanModal from './components/PaymentPlanModal';        // Modal del plan de pagos

/**
 * Página del Simulador de Crédito.
 * Permite al usuario:
 * - Simular un crédito ingresando monto, tasa de interés y plazo
 * - Ver el resultado (cuota mensual calculada)
 * - Ver el historial de simulaciones realizadas
 * - "Tomar" un crédito simulado (marcarlo como aceptado)
 * - Ver el plan de pagos detallado (tabla de amortización)
 * - Exportar simulaciones y planes de pago a Excel
 */
export default function CreditSimulator() {
  // Desestructura todos los estados y funciones del hook
  const {
    simulations,       // Historial de simulaciones
    loading,           // Estado de carga del historial
    error,             // Error general
    formError,         // Error del formulario
    submitting,        // Indica si se está simulando
    result,            // Resultado de la última simulación
    form,              // Datos del formulario
    setForm,           // Actualiza el formulario
    handleSubmit,      // Envía la simulación
    handleTake,        // Toma un crédito
    handleExport,      // Exporta historial a Excel
    handleViewPlan,    // Ve el plan de pagos
    handleClosePlan,   // Cierra el modal del plan
    handleExportPlan,  // Exporta plan de pagos a Excel
    paymentPlan,       // Datos del plan de pagos para el modal
    loadingPlan,       // Cargando plan de pagos
    fetchSimulations,  // Recarga las simulaciones
  } = useCreditSimulator();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Simulador de Crédito</h1>

      {/* Sección superior: Formulario de simulación + Resultado, lado a lado en desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Formulario de simulación de crédito */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Simular crédito</h2>
          {/* Error del formulario */}
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de monto del crédito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 10000000"
                min="0"
                step="any"
              />
            </div>
            {/* Campo de tasa de interés anual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de interés anual (%)</label>
              <input
                type="number"
                value={form.interestRate || ''}
                onChange={(e) => setForm({ ...form, interestRate: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 12"
                min="0"
                step="any"
              />
            </div>
            {/* Campo de plazo en meses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses)</label>
              <input
                type="number"
                value={form.months || ''}
                onChange={(e) => setForm({ ...form, months: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 24"
                min="1"
              />
            </div>
            {/* Botón para ejecutar la simulación */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Simulando...' : 'Simular'}
            </button>
          </form>
        </div>

        {/* Panel de resultado: muestra el resultado o un placeholder */}
        {result ? (
          // Resultado de la simulación: muestra los detalles del crédito calculado
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resultado</h2>
            <div className="space-y-3">
              {/* Monto del crédito */}
              <div className="flex justify-between">
                <span className="text-gray-500">Monto:</span>
                <span className="font-semibold">{formatCurrency(result.amount)}</span>
              </div>
              {/* Tasa de interés */}
              <div className="flex justify-between">
                <span className="text-gray-500">Tasa de interés:</span>
                <span className="font-semibold">{result.interestRate}%</span>
              </div>
              {/* Plazo en meses */}
              <div className="flex justify-between">
                <span className="text-gray-500">Plazo:</span>
                <span className="font-semibold">{result.months} meses</span>
              </div>
              <hr />
              {/* Cuota mensual calculada (destacada en grande) */}
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Cuota mensual:</span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatCurrency(result.monthlyPayment)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Placeholder cuando no hay resultado aún
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-3">💰</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Sin resultado aún</h2>
            <p className="text-sm text-gray-400">Completa el formulario y presiona &quot;Simular&quot; para ver el resultado aquí</p>
          </div>
        )}
      </div>

      {/* Sección de historial de simulaciones */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Historial de simulaciones</h2>
        {/* Botón de exportar historial a Excel: solo visible si hay simulaciones */}
        {simulations.length > 0 && (
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer"
          >
            Exportar Excel
          </button>
        )}
      </div>

      {/* Alerta de error general con opción de reintentar */}
      {error && <ErrorAlert message={error} onRetry={fetchSimulations} />}

      {/* Contenido: spinner, mensaje vacío o tabla de simulaciones */}
      {loading ? (
        <LoadingSpinner />
      ) : simulations.length === 0 ? (
        // Mensaje cuando no hay simulaciones
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No hay simulaciones aún</p>
          <p className="text-sm">Usa el formulario para simular tu primer crédito</p>
        </div>
      ) : (
        // Tabla con el historial de simulaciones
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Interés</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plazo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cuota mensual</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {simulations.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatCurrency(s.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.interestRate}%</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.months} meses</td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                    {formatCurrency(s.monthlyPayment)}
                  </td>
                  {/* Badge de estado: verde si fue tomado, amarillo si solo fue simulado */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.isTaken ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {s.isTaken ? 'Tomado' : 'Simulado'}
                    </span>
                  </td>
                  {/* Botones de acción: ver plan de pagos y tomar crédito */}
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* Botón para ver el plan de pagos (tabla de amortización) */}
                    <button
                      onClick={() => handleViewPlan(s.id)}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition cursor-pointer"
                    >
                      Ver plan de pagos
                    </button>
                    {/* Botón para tomar el crédito: solo visible si no ha sido tomado */}
                    {!s.isTaken && (
                      <button
                        onClick={() => handleTake(s.id)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition cursor-pointer"
                      >
                        Tomar crédito
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal del plan de pagos: se muestra cuando se selecciona "Ver plan de pagos" */}
      <PaymentPlanModal
        paymentPlan={paymentPlan}
        loadingPlan={loadingPlan}
        onClose={handleClosePlan}
        onExport={handleExportPlan}
      />
    </div>
  );
}
