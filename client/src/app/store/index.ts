import { ActionReducerMap } from '@ngrx/store';

import { budgetReducer, BudgetState } from './budget/budget.reducer';
import { userReducer, UserState } from './user/user.reducer';
import { incomeReducer, IncomeState } from './income/income.reducer';
import { expensesReducer, ExpensesState } from './expenses/expenses.reducer';

export const stateFeatureKey = 'state';

export interface State {
  budget: BudgetState;
  user: UserState;
  income: IncomeState;
  expenses: ExpensesState;
}

export const reducers: ActionReducerMap<State> = {
  budget: budgetReducer,
  user: userReducer,
  income: incomeReducer,
  expenses: expensesReducer,
};
