import { createReducer, on } from '@ngrx/store';
import { TActions } from '@app/shared/models/actions.model';

import { BudgetActions } from '../budget/budget.actions';
import { IncomeActions } from '../income/income.actions';
import { ExpensesActions } from '../expenses/expenses.actions';
import { UserActions } from '../user/user.actions';

export const statusFeatureKey = 'status';

export interface StatusState {
  action: TActions | undefined;
  success: boolean | undefined;
  error: unknown;
}

export const initialState: StatusState = {
  action: undefined,
  success: false,
  error: undefined,
};

export const statusReducer = createReducer(
  initialState,
  on(UserActions.updateUserSuccess, (state): StatusState => {
    return {
      ...state,
      action: 'updateUserPassword',
      success: true,
      error: undefined,
    };
  }),
  on(UserActions.updateUserFailure, (state, { error }): StatusState => {
    return {
      ...state,
      action: 'updateUserPassword',
      success: false,
      error,
    };
  }),
  on(BudgetActions.createBudgetSuccess, (state): StatusState => {
    return {
      ...state,
      action: 'createBudget',
      success: true,
      error: undefined,
    };
  }),
  on(BudgetActions.createBudgetFailure, (state, { error }): StatusState => {
    return {
      ...state,
      action: 'createBudget',
      success: false,
      error,
    };
  }),
  on(BudgetActions.updateBudgetSuccess, (state): StatusState => {
    return {
      ...state,
      action: 'updateBudget',
      success: true,
      error: undefined,
    };
  }),
  on(BudgetActions.updateBudgetFailure, (state, { error }): StatusState => {
    return {
      ...state,
      action: 'updateBudget',
      success: false,
      error,
    };
  }),
  on(BudgetActions.deleteBudgetSuccess, (state): StatusState => {
    return {
      ...state,
      action: 'deleteBudget',
      success: true,
      error: undefined,
    };
  }),
  on(BudgetActions.deleteBudgetFailure, (state, { error }): StatusState => {
    return {
      ...state,
      action: 'deleteBudget',
      success: false,
      error,
    };
  }),
  on(IncomeActions.createIncomeSuccess, (state): StatusState => {
    return {
      ...state,
      action: 'createIncome',
      success: true,
      error: undefined,
    };
  }),
  on(IncomeActions.createIncomeFailure, (state, { error }): StatusState => {
    return {
      ...state,
      action: 'createIncome',
      success: false,
      error,
    };
  }),
  on(ExpensesActions.createExpenseSuccess, (state): StatusState => {
    return {
      ...state,
      action: 'createExpenses',
      success: true,
      error: undefined,
    };
  }),
  on(ExpensesActions.createExpenseFailure, (state, { error }): StatusState => {
    return {
      ...state,
      action: 'createExpenses',
      success: false,
      error,
    };
  })
);
