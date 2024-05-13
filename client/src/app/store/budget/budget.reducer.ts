import { createReducer, on } from '@ngrx/store';
import { CurrencyType } from '@app/shared/models/budget.model';

import { BudgetActions } from './budget.actions';

export const budgetFeatureKey = 'budget';

export interface BudgetState {
  id: string | undefined;
  name: string | undefined;
  currency: CurrencyType | undefined;
  goal: number | undefined;
}

export const initialState: BudgetState = {
  id: undefined,
  name: undefined,
  currency: undefined,
  goal: undefined,
};

export const budgetReducer = createReducer(
  initialState,
  on(BudgetActions.createBudgetSuccess, (state, budget): BudgetState => {
    return {
      ...state,
      id: budget.id,
      name: budget.name,
      currency: budget.currency,
      goal: budget.goal,
    };
  }),
  on(BudgetActions.getBudgetSuccess, (state, budget): BudgetState => {
    return {
      ...state,
      id: budget.id,
      name: budget.name,
      currency: budget.currency,
      goal: budget.goal,
    };
  })
);
