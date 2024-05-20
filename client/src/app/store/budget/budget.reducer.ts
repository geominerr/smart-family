import { createReducer, on } from '@ngrx/store';
import { CurrencyType } from '@app/shared/models/budget.model';

import { BudgetActions } from './budget.actions';

export const budgetFeatureKey = 'budget';

export interface BudgetState {
  id: string | undefined;
  name: string | undefined;
  currency: CurrencyType | undefined;
  goal: number | undefined;
  demo: boolean | undefined;
}

export const initialState: BudgetState = {
  id: undefined,
  name: undefined,
  currency: undefined,
  goal: undefined,
  demo: undefined,
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
      demo: budget.demo,
    };
  }),
  on(BudgetActions.getBudgetSuccess, (state, budget): BudgetState => {
    return {
      ...state,
      id: budget.id,
      name: budget.name,
      currency: budget.currency,
      goal: budget.goal,
      demo: budget.demo,
    };
  }),
  on(BudgetActions.deleteBudgetSuccess, (state): BudgetState => {
    return {
      ...state,
      id: undefined,
      name: undefined,
      currency: undefined,
      goal: undefined,
      demo: undefined,
    };
  })
);
