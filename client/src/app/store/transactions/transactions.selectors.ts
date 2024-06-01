import { createSelector } from '@ngrx/store';

import { combineMonthGroupWithType } from '@app/shared/utils/converte-to-view-data.util';

import { selectExpensesByMonth } from '../expenses/expenses.selectors';
import { selectIncomeByMonth } from '../income/income.selectors';

export const selectTransactions = createSelector(
  selectExpensesByMonth,
  selectIncomeByMonth,
  (expenseMap, incomeMap) => {
    return combineMonthGroupWithType([incomeMap, expenseMap]);
  }
);

export const selectLastMonthTransactions = createSelector(
  selectExpensesByMonth,
  selectIncomeByMonth,
  (expenseMap, incomeMap) => {
    return combineMonthGroupWithType([incomeMap, expenseMap])[0];
  }
);
