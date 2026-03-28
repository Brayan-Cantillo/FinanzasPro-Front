import api from './api'; // Instancia de Axios configurada

// Estructura de datos de una simulación de crédito
export interface CreditSimulation {
  id: number;            // Identificador único de la simulación
  amount: number;        // Monto del crédito solicitado
  interestRate: number;  // Tasa de interés anual en porcentaje
  months: number;        // Plazo del crédito en meses
  monthlyPayment: number; // Cuota mensual calculada
  isTaken: boolean;      // Indica si el crédito fue tomado (aceptado) por el usuario
}

// Estructura de una fila de la tabla de amortización
export interface AmortizationRow {
  month: number;     // Número del mes
  payment: number;   // Valor de la cuota mensual
  principal: number; // Porción de la cuota que va a capital
  interest: number;  // Porción de la cuota que va a intereses
  balance: number;   // Saldo pendiente después del pago
}

// Estructura del plan de pagos completo (incluye la simulación + tabla de amortización)
export interface PaymentPlan extends CreditSimulation {
  amortizationTable: AmortizationRow[]; // Tabla de amortización mes a mes
}

// Datos necesarios para crear una nueva simulación de crédito
export interface SimulatePayload {
  amount: number;        // Monto que se desea simular
  interestRate: number;  // Tasa de interés anual
  months: number;        // Número de meses del plazo
}

/**
 * Servicio de simulación de crédito.
 * Proporciona funciones para simular créditos, obtener el historial,
 * tomar un crédito y consultar el plan de pagos detallado.
 */
export const creditService = {
  // Simula un nuevo crédito con los parámetros dados y retorna la simulación calculada
  simulate: (data: SimulatePayload) => api.post<CreditSimulation>('/credit-simulator', data),
  // Obtiene todas las simulaciones de crédito del usuario
  getAll: () => api.get<CreditSimulation[]>('/credit-simulator'),
  // Marca una simulación como "tomada" (el usuario acepta el crédito)
  take: (id: number) => api.patch<CreditSimulation>(`/credit-simulator/${id}/take`),
  // Obtiene el plan de pagos detallado (tabla de amortización) de una simulación
  getPaymentPlan: (id: number) => api.get<PaymentPlan>(`/credit-simulator/${id}/payment-plan`),
};
