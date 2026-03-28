import api from './api';

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface CreateTransactionPayload {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const transactionService = {
  getAll: () => api.get<Transaction[]>('/transactions'),
  create: (data: CreateTransactionPayload) => api.post<Transaction>('/transactions', data),
  update: (id: number, data: Partial<CreateTransactionPayload>) =>
    api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
};
