import { Expense, ExpenseView, TExpenseCategory } from './expense.model';
import { Income, IncomeView, TIncomeCategory } from './income.model';

export type TTransaction = Expense | Income;

export type TTransactionView = ExpenseView | IncomeView;

export type TTransactionCategory = TExpenseCategory | TIncomeCategory;

export interface TransactionsByMonth<T> {
  [key: string]: T[];
}

export interface TransactionsBreakdown {
  period: string;
  income: Income[];
  expenses: Expense[];
}
