import { createReducer, on } from '@ngrx/store';
import { Income } from '@app/shared/models/income.model';

import { IncomeActions } from './income.actions';

export const incomeFeatureKey = 'income';

export interface IncomeState {
  income: Income[];
}

export const initialState: IncomeState = {
  income: [],
};

export const incomeReducer = createReducer(
  initialState,
  on(
    IncomeActions.setAllIncome,
    (state, { income }): IncomeState => ({ ...state, income })
  ),
  on(
    IncomeActions.createIncomeSuccess,
    (state, income): IncomeState => ({
      ...state,
      income: [income, ...state.income],
    })
  ),
  on(
    IncomeActions.deleteAllIncome,
    (state): IncomeState => ({
      ...state,
      income: [],
    })
  )
);
