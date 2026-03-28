// Interfaz del formulario de edición de perfil
export interface ProfileForm {
  name: string;    // Nombre del usuario
  email: string;   // Email del usuario (no editable, solo se muestra)
  salary: number;  // Salario mensual del usuario
}

// Parámetros que recibe la función generadora de consejos financieros
export interface FinancialTipsParams {
  salary: number;               // Salario mensual registrado
  income: number;               // Total de ingresos del periodo
  expenses: number;             // Total de gastos del periodo
  balance: number;              // Balance (ingresos - gastos)
  savingsRate: number;          // Tasa de ahorro en porcentaje
  expenseToSalaryRatio: number; // Ratio de gastos respecto al salario en porcentaje
}
