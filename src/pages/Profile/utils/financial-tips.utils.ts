import type { FinancialTipsParams } from '../types';

/**
 * Genera una lista de consejos financieros personalizados basados en los indicadores del usuario.
 * Evalúa la tasa de ahorro, el ratio de gastos vs salario y el balance
 * para producir recomendaciones específicas.
 *
 * @param params - Indicadores financieros del usuario
 * @returns Array de strings con consejos financieros
 */
export const generateFinancialTips = (params: FinancialTipsParams): string[] => {
  const { salary, balance, savingsRate, expenseToSalaryRatio } = params;
  const tips: string[] = [];

  // Análisis de la tasa de ahorro: qué porcentaje de los ingresos se ahorra
  if (savingsRate < 10)
    tips.push('Tu tasa de ahorro es baja. Intenta ahorrar al menos el 20% de tus ingresos.');
  else if (savingsRate < 20)
    tips.push('Vas por buen camino, pero intenta llegar al 20% de ahorro.');
  else
    tips.push('¡Excelente! Estás ahorrando más del 20% de tus ingresos.');

  // Análisis del ratio gastos vs salario (solo si tiene salario registrado)
  if (salary > 0 && expenseToSalaryRatio > 80)
    tips.push('Tus gastos superan el 80% de tu salario. Revisa gastos innecesarios.');
  else if (salary > 0 && expenseToSalaryRatio > 50)
    tips.push(`Tus gastos son el ${Math.round(expenseToSalaryRatio)}% de tu salario. Aún tienes margen.`);
  else if (salary > 0)
    tips.push('Tus gastos están bien controlados respecto a tu salario.');

  // Alerta si el balance es negativo
  if (balance < 0)
    tips.push('⚠️ Tu balance es negativo. Es importante reducir gastos o aumentar ingresos.');

  // Consejo si no tiene salario registrado
  if (salary === 0)
    tips.push('Registra tu salario para obtener un análisis más completo de tus finanzas.');

  return tips;
};
