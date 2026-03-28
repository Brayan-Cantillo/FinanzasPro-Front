/**
 * Formatea un valor numérico como moneda colombiana (COP).
 * Ejemplo: 1500000 -> "$1.500.000"
 * Usa el formato de Colombia (es-CO) sin decimales.
 *
 * @param value - Valor numérico a formatear
 * @returns Cadena formateada como moneda colombiana
 */
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',       // Formato de moneda
    currency: 'COP',         // Peso colombiano
    maximumFractionDigits: 0, // Sin decimales
  }).format(value);
