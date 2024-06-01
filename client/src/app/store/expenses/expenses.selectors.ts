import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  groupByWeekWithDailySums,
  sortByDate,
} from '@app/shared/utils/group-by-week.util';
import {
  getLastMonthWithCategorySums,
  groupByMonth,
} from '@app/shared/utils/group-by-month.util';

import { expensesFeatureKey, ExpensesState } from './expenses.reducer';

export const selectExpensesState =
  createFeatureSelector<ExpensesState>(expensesFeatureKey);

export const selectExpenses = createSelector(
  selectExpensesState,
  (state: ExpensesState) => {
    return sortByDate([...state.expenses]);
  }
);

export const selectExpensesConvertedToDataChartSource = createSelector(
  selectExpensesState,
  (state: ExpensesState) => {
    if (state.expenses?.length) {
      return groupByWeekWithDailySums([...state.expenses]);
    }

    return [];
  }
);

export const selectExpensesByMonth = createSelector(
  selectExpensesState,
  (state: ExpensesState) => {
    if (state.expenses?.length) {
      return groupByMonth([...state.expenses]);
    }

    return {};
  }
);

export const selectLastMonthExpenses = createSelector(
  selectExpensesState,
  (state: ExpensesState) => {
    if (state.expenses?.length) {
      return getLastMonthWithCategorySums([...state.expenses]);
    }

    return [];
  }
);
