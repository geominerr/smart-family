import { createReducer, on } from '@ngrx/store';
import { Expense } from '@app/shared/models/expense.model';

import { ExpensesActions } from './expenses.actions';

export const expensesFeatureKey = 'expenses';

export interface ExpensesState {
  expenses: Expense[];
}

export const initialState: ExpensesState = {
  expenses: [],
};

export const expensesReducer = createReducer(
  initialState,
  on(
    ExpensesActions.setAllExpenses,
    (state, { expenses }): ExpensesState => ({
      ...state,
      expenses: [...expenses],
    })
  ),
  on(
    ExpensesActions.createExpenseSuccess,
    (state, expense): ExpensesState => ({
      ...state,
      expenses: [expense, ...state.expenses],
    })
  )
);
