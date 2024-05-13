import { createFeatureSelector, createSelector } from '@ngrx/store';
import { budgetFeatureKey, BudgetState } from './budget.reducer';

export const selectBudgetState =
  createFeatureSelector<BudgetState>(budgetFeatureKey);

export const selectCurrencyType = createSelector(
  selectBudgetState,
  (state: BudgetState) => state.currency
);

export const selectBudgetId = createSelector(
  selectBudgetState,
  (state: BudgetState) => state.id
);
