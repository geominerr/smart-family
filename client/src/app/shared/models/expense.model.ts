export type TExpenseCategory =
  | 'HOUSING'
  | 'TRANSPORTATION'
  | 'FOOD'
  | 'UTILITIES'
  | 'CLOTHING'
  | 'HEALTHCARE'
  | 'INSURANCE'
  | 'HOUSEHOLD_ITEMS'
  | 'PERSONAL'
  | 'DEBT'
  | 'RETIREMENT'
  | 'EDUCATION'
  | 'SAVINGS'
  | 'GIFTS'
  | 'ENTERTAINMENT';

export interface ExpenseUpdateDto {
  budgetId: string;
  userId: string;
  date: string;
  amount?: number;
  category?: TExpenseCategory;
  description?: string | null;
}

export interface ExpenseCreateDto extends ExpenseUpdateDto {
  amount: number;
  category: TExpenseCategory;
}

export interface Expense extends ExpenseCreateDto {
  id: string;
}

export interface ExpenseView extends Expense {
  type: string;
}
