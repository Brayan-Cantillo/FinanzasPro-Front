import LoadingSpinner from '../../../components/LoadingSpinner';        // Spinner de carga
import { formatCurrency } from '../../../utils/format-currency.utils'; // Formateador de moneda COP
import type { PaymentPlan } from '../../../services/creditService';    // Tipo del plan de pagos

// Propiedades que recibe el componente modal
interface PaymentPlanModalProps {
  paymentPlan: PaymentPlan | null;  // Datos del plan de pagos (null si no hay plan cargado)
  loadingPlan: boolean;              // Indica si se está cargando el plan
  onClose: () => void;               // Función para cerrar el modal
  onExport: () => void;              // Función para exportar el plan a Excel
}

/**
 * Componente modal que muestra el plan de pagos detallado de una simulación de crédito.
 * Incluye:
 * - Resumen del crédito (monto, interés, plazo, cuota mensual)
 * - Tabla de amortización mes a mes (cuota, capital, interés, saldo)
 * - Botón para exportar la tabla a Excel
 * Si no hay plan cargado ni cargando, no renderiza nada.
 */
export default function PaymentPlanModal({ paymentPlan, loadingPlan, onClose, onExport }: PaymentPlanModalProps) {
  // No renderiza el modal si no hay plan ni se está cargando
  if (!paymentPlan && !loadingPlan) return null;

  return (
    // Fondo oscuro semitransparente que cubre toda la pantalla (overlay)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Contenedor del modal: tarjeta blanca con scroll interno */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Encabezado del modal: título, botón exportar y botón cerrar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Plan de pagos</h2>
          <div className="flex items-center gap-3">
            {/* Botón de exportar: solo visible cuando ya se cargó el plan */}
            {paymentPlan && (
              <button
                onClick={onExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer"
              >
                Exportar Excel
              </button>
            )}
            {/* Botón para cerrar el modal (X) */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Cuerpo del modal con scroll vertical */}
        <div className="p-6 overflow-y-auto">
          {loadingPlan ? (
            // Muestra spinner mientras se carga el plan
            <LoadingSpinner />
          ) : paymentPlan ? (
            <>
              {/* Resumen del crédito: 4 tarjetas con monto, interés, plazo y cuota */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Monto</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(paymentPlan.amount)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Interés</p>
                  <p className="font-semibold text-gray-800">{paymentPlan.interestRate}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Plazo</p>
                  <p className="font-semibold text-gray-800">{paymentPlan.months} meses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Cuota mensual</p>
                  <p className="font-semibold text-indigo-600">{formatCurrency(paymentPlan.monthlyPayment)}</p>
                </div>
              </div>

              {/* Tabla de amortización: desglose mes a mes */}
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Mes</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Cuota</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Capital</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Interés</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Itera cada fila de la tabla de amortización */}
                  {paymentPlan.amortizationTable.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 text-sm text-gray-800">{row.month}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-800">{formatCurrency(row.payment)}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-600">{formatCurrency(row.principal)}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-600">{formatCurrency(row.interest)}</td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-800">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
