// Componentes de la librería Recharts para gráficos de pastel (PieChart)
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// Componentes reutilizables de la aplicación
import LoadingSpinner from '../../components/LoadingSpinner'; // Spinner de carga
import ErrorAlert from '../../components/ErrorAlert';         // Alerta de error con opción de reintento
import { formatCurrency } from '../../utils/format-currency.utils'; // Formateador de moneda COP
import { useDashboard } from './hooks'; // Hook con toda la lógica del dashboard

// Opciones de periodo para el selector desplegable (filtro de tiempo)
const PERIOD_OPTIONS = [
  { value: 'day', label: 'Hoy' },
  { value: 'month', label: 'Este mes' },
  { value: 'trimester', label: 'Trimestre' },
  { value: 'semester', label: 'Semestre' },
  { value: 'year', label: 'Año' },
] as const;

/**
 * Página del Dashboard principal.
 * Muestra un resumen financiero del usuario con:
 * - Tarjetas de ingresos, gastos y balance
 * - Gráfico de pastel de Ingresos vs Gastos
 * - Gráfico de pastel de Gastos por Categoría
 * - Lista de consejos financieros personalizados
 * - Selector de periodo para filtrar los datos
 */
export default function Dashboard() {
  // Obtiene todos los datos y funciones del hook del dashboard
  const { metrics, loading, error, chartData, categoryData, tips, period, setPeriod, fetchData } = useDashboard();

  // Muestra spinner mientras se cargan los datos
  if (loading) return <LoadingSpinner />;
  // Muestra alerta de error con botón de reintento si falla la carga
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;
  // Si no hay métricas, no renderiza nada
  if (!metrics) return null;

  return (
    <div>
      {/* Encabezado: título y selector de periodo */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {/* Selector desplegable para cambiar el periodo de tiempo */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as typeof period)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Tarjetas de resumen: Ingresos, Gastos y Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de Total Ingresos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Ingresos</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalIncome)}</p>
        </div>
        {/* Tarjeta de Total Gastos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Gastos</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(metrics.totalExpenses)}</p>
        </div>
        {/* Tarjeta de Balance: cambia de color según sea positivo o negativo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Balance</p>
          <p className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
            {formatCurrency(metrics.balance)}
          </p>
        </div>
      </div>

      {/* Sección de gráficos: dos gráficos de pastel lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos vs Gastos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ingresos vs Gastos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}   // Radio interno (crea efecto donut)
                outerRadius={120}  // Radio externo
                paddingAngle={4}   // Espacio entre segmentos
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`} // Etiqueta con porcentaje
              >
                {/* Asigna el color correspondiente a cada segmento */}
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v))} /> {/* Tooltip con formato de moneda */}
              <Legend /> {/* Leyenda del gráfico */}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Gastos por Categoría */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Gastos por Categoría</h2>
          {/* Si no hay gastos, muestra un mensaje vacío */}
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              No hay gastos registrados
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sección de Consejos Financieros: se muestra solo si hay consejos */}
      {tips.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">💡 Consejos financieros</h2>
          {/* Lista numerada de consejos personalizados */}
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                {/* Número del consejo en un círculo indigo */}
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                {/* Texto del consejo */}
                <p className="text-sm text-gray-700">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
