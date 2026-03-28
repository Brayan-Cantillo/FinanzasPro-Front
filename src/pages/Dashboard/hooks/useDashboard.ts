import { useCallback, useEffect, useState } from 'react';
import { metricsService } from '../../../services/metricsService';
import type { MetricsSummary, ExpenseByCategory, Period } from '../../../services/metricsService';
import type { ChartDataItem } from '../types';
import { CATEGORY_COLORS } from '../utils';

// Función auxiliar para formatear valores como moneda colombiana (COP)
const fmt = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

/**
 * Genera una lista de consejos financieros personalizados basados en las métricas del usuario.
 * Analiza el ratio gastos/ingresos, el ahorro, las categorías de gasto y el periodo seleccionado
 * para producir recomendaciones específicas y útiles.
 *
 * @param m - Resumen de métricas (ingresos, gastos, balance)
 * @param categories - Desglose de gastos por categoría
 * @param period - Periodo de tiempo seleccionado (día, mes, trimestre, etc.)
 * @returns Array de strings con consejos financieros personalizados
 */
function buildTips(m: MetricsSummary, categories: ExpenseByCategory[], period: Period): string[] {
  const tips: string[] = [];
  const ratio = m.totalExpenses / (m.totalIncome || 1); // Ratio de gastos sobre ingresos (evita división por cero)
  const savings = m.totalIncome - m.totalExpenses;       // Monto ahorrado (puede ser negativo)

  // -- Sin movimientos: no hay datos para analizar --
  if (m.totalIncome === 0 && m.totalExpenses === 0) {
    tips.push('No hay movimientos en este periodo. Registra tus ingresos y gastos para recibir consejos personalizados.');
    tips.push('Llevar un registro constante de tus finanzas es el primer paso para tomar mejores decisiones económicas.');
    return tips;
  }

  // -- Análisis general del ratio gastos/ingresos --
  // Se evalúan diferentes rangos del ratio para dar consejos apropiados
  if (m.balance < 0) {
    // Balance negativo: los gastos superan los ingresos
    tips.push(`Tus gastos superan tus ingresos por ${fmt(Math.abs(m.balance))}. Es fundamental reducir gastos no esenciales o buscar fuentes adicionales de ingreso.`);
    tips.push('Cuando los gastos superan los ingresos, considera crear un presupuesto de emergencia y eliminar suscripciones o gastos innecesarios.');
  } else if (ratio > 0.9) {
    // Gastando más del 90% de los ingresos: zona de peligro
    tips.push(`Estás gastando el ${(ratio * 100).toFixed(0)}% de tus ingresos. Estás muy cerca del límite — cualquier imprevisto podría dejarte en números rojos.`);
    tips.push('Intenta identificar al menos 2 o 3 gastos que podrías reducir este mes para crear un colchón financiero.');
  } else if (ratio > 0.8) {
    // Gastando más del 80%: se sugiere la regla 50/30/20
    tips.push(`Gastas más del 80% de tus ingresos. La regla 50/30/20 sugiere destinar máximo 50% a necesidades, 30% a deseos y 20% a ahorro.`);
  } else if (ratio > 0.5) {
    // Gastando entre 50% y 80%: buen balance pero mejorable
    tips.push(`Gastas el ${(ratio * 100).toFixed(0)}% de tus ingresos. Buen balance, pero siempre hay espacio para optimizar.`);
  } else if (m.totalIncome > 0) {
    // Gastando menos del 50%: excelente capacidad de ahorro
    tips.push(`¡Excelente! Solo gastas el ${(ratio * 100).toFixed(0)}% de tus ingresos. Tienes una capacidad de ahorro por encima del promedio.`);
  }

  // -- Sin ingresos pero con gastos: posible omisión de datos --
  if (m.totalIncome === 0 && m.totalExpenses > 0) {
    tips.push('No registraste ingresos en este periodo pero sí gastos. Asegúrate de registrar todas tus fuentes de ingreso para un análisis completo.');
  }

  // -- Excedente / Ahorro: consejos sobre qué hacer con el dinero sobrante --
  if (savings > 0) {
    tips.push(`Tienes un excedente de ${fmt(savings)}. Destina al menos una parte a un fondo de emergencia que cubra 3 a 6 meses de gastos.`);
    // Si el ahorro supera el 30% de los ingresos, sugiere inversión
    if (savings > m.totalIncome * 0.3) {
      tips.push('Con tu nivel de ahorro podrías considerar opciones de inversión como CDTs, fondos de inversión colectiva o ETFs para hacer crecer tu dinero.');
    }
    // Si el ahorro supera el 20%, sugiere automatizar
    if (savings > m.totalIncome * 0.2) {
      tips.push('Automatiza tu ahorro: transfiere una parte fija de tu ingreso a una cuenta de ahorros el mismo día que recibes tu pago.');
    }
  }

  // -- Análisis por categorías: identifica en qué se gasta más --
  if (categories.length > 0) {
    // Muestra la categoría con mayor gasto
    const topCategory = categories[0];
    tips.push(`Tu mayor gasto es "${topCategory.category}" con ${fmt(topCategory.amount)} (${topCategory.percentage.toFixed(1)}% del total). Revisa si puedes optimizarlo.`);

    // Si hay 3 o más categorías, muestra el top 3
    if (categories.length >= 3) {
      const top3Names = categories.slice(0, 3).map((c) => c.category).join(', ');
      const top3Pct = categories.slice(0, 3).reduce((s, c) => s + c.percentage, 0);
      tips.push(`Tus 3 categorías principales (${top3Names}) representan el ${top3Pct.toFixed(0)}% de tus gastos. Concentra tu esfuerzo de ahorro ahí.`);
    }

    // Análisis específico de alimentación: alerta si supera el 30%
    const foodCat = categories.find((c) => c.category.toLowerCase().includes('alimentación') || c.category.toLowerCase().includes('comida'));
    if (foodCat && foodCat.percentage > 30) {
      tips.push(`Gastas el ${foodCat.percentage.toFixed(0)}% en alimentación. Planificar tu menú semanal y cocinar en casa puede reducir este gasto significativamente.`);
    }

    // Análisis específico de entretenimiento: alerta si supera el 20%
    const entertainmentCat = categories.find((c) => c.category.toLowerCase().includes('entretenimiento') || c.category.toLowerCase().includes('ocio'));
    if (entertainmentCat && entertainmentCat.percentage > 20) {
      tips.push(`El entretenimiento representa el ${entertainmentCat.percentage.toFixed(0)}% de tus gastos. Busca alternativas gratuitas o más económicas.`);
    }

    // Análisis específico de transporte: alerta si supera el 25%
    const transportCat = categories.find((c) => c.category.toLowerCase().includes('transporte'));
    if (transportCat && transportCat.percentage > 25) {
      tips.push(`El transporte consume el ${transportCat.percentage.toFixed(0)}% de tus gastos. Considera compartir vehículo, usar transporte público o bicicleta.`);
    }

    // Si hay muchas categorías, alerta sobre gastos hormiga
    if (categories.length >= 5) {
      tips.push('Tienes gastos en muchas categorías. Prioriza y elimina los gastos hormiga — los pequeños gastos diarios suman mucho al final del mes.');
    }
  }

  // -- Tips generales según el periodo seleccionado --
  const periodLabels: Record<Period, string> = {
    day: 'diario',
    month: 'mensual',
    trimester: 'trimestral',
    semester: 'semestral',
    year: 'anual',
  };
  tips.push(`Estás viendo tu resumen ${periodLabels[period]}. Compara diferentes periodos para identificar tendencias en tus finanzas.`);

  if (period === 'month') {
    tips.push('Revisa tu presupuesto mensual al inicio de cada mes y ajústalo según tus prioridades. La disciplina es clave.');
  }
  if (period === 'year') {
    tips.push('Al ver el acumulado anual, identifica los meses donde más gastaste y prepárate mejor para esos periodos el próximo año.');
  }

  // -- Tips de educación financiera general --
  if (m.totalIncome > 0) {
    tips.push('Recuerda la regla del "paga primero a ti mismo": antes de gastar, aparta un porcentaje fijo para ahorro o inversión.');
    // Si el ratio es bajo (<=70%), sugiere metas a mediano plazo
    if (ratio <= 0.7) {
      tips.push('Con tu capacidad de ahorro actual, podrías proyectar metas a mediano plazo como un viaje, un curso o el pago anticipado de deudas.');
    }
  }

  return tips;
}

/**
 * Hook personalizado que encapsula toda la lógica del Dashboard.
 * Maneja la carga de métricas financieras, el filtro por periodo,
 * la preparación de datos para los gráficos y la generación de consejos.
 */
export const useDashboard = () => {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);           // Resumen de métricas
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseByCategory[]>([]); // Gastos por categoría
  const [loading, setLoading] = useState(true);                                    // Estado de carga
  const [error, setError] = useState('');                                           // Mensaje de error
  const [period, setPeriod] = useState<Period>('month');                            // Periodo seleccionado (por defecto: mes)

  /**
   * Carga las métricas del servidor.
   * Hace dos peticiones en paralelo: resumen financiero y gastos por categoría.
   * Se recrea cuando cambia el periodo seleccionado (useCallback con dependencia [period]).
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Ejecuta ambas peticiones en paralelo para mayor eficiencia
      const [metricsRes, categoryRes] = await Promise.all([
        metricsService.getSummary(period),              // Obtiene ingresos, gastos y balance
        metricsService.getExpensesByCategory(period),   // Obtiene desglose por categoría
      ]);
      setMetrics(metricsRes.data);
      setExpensesByCategory(categoryRes.data);
    } catch {
      setError('Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Efecto que carga los datos cada vez que cambia el periodo o se monta el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepara datos para el gráfico de Ingresos vs Gastos (PieChart)
  const chartData: ChartDataItem[] = metrics
    ? [
        { name: 'Ingresos', value: metrics.totalIncome, color: '#22c55e' },   // Verde para ingresos
        { name: 'Gastos', value: metrics.totalExpenses, color: '#ef4444' },    // Rojo para gastos
      ]
    : [];

  // Prepara datos para el gráfico de Gastos por Categoría (PieChart)
  // Asigna colores cíclicamente desde la paleta CATEGORY_COLORS
  const categoryData: ChartDataItem[] = expensesByCategory.map((item, i) => ({
    name: item.category,
    value: item.amount,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  // Genera consejos financieros personalizados basados en las métricas actuales
  const tips = metrics ? buildTips(metrics, expensesByCategory, period) : [];

  // Retorna todos los estados, datos procesados y funciones para la vista
  return { metrics, loading, error, chartData, categoryData, tips, period, setPeriod, fetchData };
};
