import { createFeatureSelector, createSelector } from '@ngrx/store';
import { sortByDate } from '@app/shared/utils/group-by-week.util';

import {
  groupByMonth,
  groupByMonthAndCategory,
} from '@app/shared/utils/group-by-month.util';
import { converteToChartData } from '@app/shared/utils/converte-to-view-data.util';

import { incomeFeatureKey, IncomeState } from './income.reducer';

export const selectIncomeState =
  createFeatureSelector<IncomeState>(incomeFeatureKey);

export const selectIncome = createSelector(
  selectIncomeState,
  (state: IncomeState) => {
    return sortByDate([...state.income]);
  }
);

export const selectMonthlyIncomeChartSource = createSelector(
  selectIncomeState,
  (state: IncomeState) => {
    if (state.income?.length) {
      return converteToChartData(groupByMonthAndCategory([...state.income]));
    }

    return [];
  }
);

export const selectIncomeByMonth = createSelector(
  selectIncomeState,
  (state: IncomeState) => {
    if (state.income?.length) {
      return groupByMonth([...state.income]);
    }

    return {};
  }
);
