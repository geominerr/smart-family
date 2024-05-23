export type TIncomeCategory =
  | 'SALARY'
  | 'FREELANCE'
  | 'INVESTMENTS'
  | 'BUSINESS_INCOME'
  | 'RENTAL_INCOME'
  | 'GIFTS'
  | 'OTHER';

export interface IncomeUpdateDto {
  budgetId: string;
  userId: string;
  date: string;
  amount?: number;
  category?: TIncomeCategory;
  description?: string | null;
}

export interface IncomeCreateDto extends IncomeUpdateDto {
  amount: number;
  category: TIncomeCategory;
}

export interface Income extends IncomeCreateDto {
  id: string;
}

export interface IncomeView extends Income {
  type: string;
}

export type TIncomeActions = 'createIncome';
