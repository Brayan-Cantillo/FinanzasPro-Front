import api from './api';

export interface MetricsSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const metricsService = {
  getSummary: () => api.get<MetricsSummary>('/metrics/summary'),
};
