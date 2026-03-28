import api from './api'; // Instancia de Axios configurada

// Estructura de una transacción financiera (ingreso o gasto)
export interface Transaction {
  id: number;                       // Identificador único de la transacción
  type: 'income' | 'expense';       // Tipo: ingreso o gasto
  amount: number;                    // Monto de la transacción
  category: string;                  // Categoría (ej: "Alimentación", "Salud")
  description: string;               // Descripción de la transacción
  date: string;                      // Fecha de la transacción (formato ISO)
}

// Datos necesarios para crear una nueva transacción
export interface CreateTransactionPayload {
  type: 'income' | 'expense';       // Tipo de transacción
  amount: number;                    // Monto
  category: string;                  // Categoría
  description: string;               // Descripción
  date: string;                      // Fecha
}

/**
 * Servicio de transacciones financieras.
 * Proporciona operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para transacciones.
 */
export const transactionService = {
  // Obtiene todas las transacciones del usuario
  getAll: () => api.get<Transaction[]>('/transactions'),
  // Crea una nueva transacción (ingreso o gasto)
  create: (data: CreateTransactionPayload) => api.post<Transaction>('/transactions', data),
  // Actualiza una transacción existente (puede actualizar campos parcialmente)
  update: (id: number, data: Partial<CreateTransactionPayload>) =>
    api.put<Transaction>(`/transactions/${id}`, data),
  // Elimina una transacción por su ID
  delete: (id: number) => api.delete(`/transactions/${id}`),
};
