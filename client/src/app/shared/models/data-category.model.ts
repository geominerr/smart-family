import { TTransaction, TTransactionCategory } from './transactions.model';

export interface CategoryDataWithoutTransactions {
  category: TTransactionCategory;
  currSum: number;
  prevSum: number;
}

export interface CategoryData extends CategoryDataWithoutTransactions {
  transactions: TTransaction[];
}

export interface GroupDataByMonth {
  month: number;
  categories: CategoryDataWithoutTransactions[];
}
