import type { CreateTransactionPayload } from '../../../services/transactionService';

/**
 * Formulario vacío con valores por defecto para crear/resetear una transacción.
 * Tipo por defecto: gasto (expense), monto: 0, fecha: hoy.
 * Se usa al abrir el formulario de nueva transacción o al cancelar una edición.
 */
export const EMPTY_FORM: CreateTransactionPayload = {
  type: 'expense',                                  // Tipo por defecto: gasto
  amount: 0,                                         // Monto inicial: 0
  category: '',                                      // Categoría vacía (debe seleccionarse)
  description: '',                                   // Descripción vacía
  date: new Date().toISOString().split('T')[0],     // Fecha de hoy en formato YYYY-MM-DD
};
