import api from './api';

export interface CreditSimulation {
  id: number;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  taken: boolean;
}

export interface SimulatePayload {
  amount: number;
  interestRate: number;
  termMonths: number;
}

export const creditService = {
  simulate: (data: SimulatePayload) => api.post<CreditSimulation>('/credit-simulator', data),
  getAll: () => api.get<CreditSimulation[]>('/credit-simulator'),
  take: (id: number) => api.patch<CreditSimulation>(`/credit-simulator/${id}/take`),
};
