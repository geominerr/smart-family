import { Expense } from './expense.model';
import { Income } from './income.model';

export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'UAH';

export interface BudgetDemoCreateDto {
  userId: string;
  currency: CurrencyType;
  goal: number;
  expensesRecords: number;
  incomeRecords: number;
  period: number;
}

export interface BudgetCreateDto {
  userId: string;
  name: string;
  currency: CurrencyType;
  goal: number;
}

export interface BudgetUpdateDto {
  name: string;
  goal: number;
}

export interface Budget {
  id: string;
  name: string;
  currency: CurrencyType;
  goal: number;
  Expenses: Expense[];
  Incomes: Income[];
}
