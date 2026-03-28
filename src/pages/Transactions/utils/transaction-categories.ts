/**
 * Lista de categorías disponibles para clasificar las transacciones.
 * Se usa en el selector desplegable del formulario de transacciones.
 * Definida como const para que TypeScript infiera tipos literales.
 */
export const TRANSACTION_CATEGORIES = [
  'Hogar',          // Gastos del hogar (arriendo, servicios)
  'Alimentación',   // Comida, mercado, restaurantes
  'Transporte',     // Gasolina, bus, taxi, peajes
  'Salud',          // Médico, medicamentos, seguro
  'Educación',      // Cursos, libros, matrículas
  'Compras',        // Ropa, electrónicos, artículos varios
  'Ocio',           // Entretenimiento, salidas, suscripciones
  'Finanzas',       // Pagos de deudas, inversiones, ahorros
  'Familia',        // Gastos familiares
  'Otros',          // Gastos que no encajan en las demás
] as const;
