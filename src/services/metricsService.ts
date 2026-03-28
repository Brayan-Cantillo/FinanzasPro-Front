import api from './api'; // Instancia de Axios configurada

// Resumen de métricas financieras del usuario
export interface MetricsSummary {
  totalIncome: number;   // Total de ingresos en el periodo
  totalExpenses: number; // Total de gastos en el periodo
  balance: number;       // Balance (ingresos - gastos)
}

// Desglose de gastos por categoría
export interface ExpenseByCategory {
  category: string;    // Nombre de la categoría (ej: "Alimentación", "Transporte")
  amount: number;      // Monto total gastado en esta categoría
  percentage: number;  // Porcentaje que representa del total de gastos
}

// Periodos disponibles para filtrar las métricas
export type Period = 'day' | 'month' | 'trimester' | 'semester' | 'year';

/**
 * Servicio de métricas financieras.
 * Proporciona funciones para obtener el resumen financiero y
 * el desglose de gastos por categoría, con filtro opcional por periodo de tiempo.
 */
export const metricsService = {
  // Obtiene el resumen de ingresos, gastos y balance, opcionalmente filtrado por periodo
  getSummary: (period?: Period) =>
    api.get<MetricsSummary>('/metrics/summary', { params: period ? { period } : undefined }),
  // Obtiene el desglose de gastos agrupados por categoría, opcionalmente filtrado por periodo
  getExpensesByCategory: (period?: Period) =>
    api.get<ExpenseByCategory[]>('/metrics/expenses-by-category', { params: period ? { period } : undefined }),
};
