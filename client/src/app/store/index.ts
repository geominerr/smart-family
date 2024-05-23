import { ActionReducerMap } from '@ngrx/store';

import { budgetReducer, BudgetState } from './budget/budget.reducer';
import { userReducer, UserState } from './user/user.reducer';
import { incomeReducer, IncomeState } from './income/income.reducer';
import { expensesReducer, ExpensesState } from './expenses/expenses.reducer';
import { statusReducer, StatusState } from './status/status.reducer';

export const stateFeatureKey = 'state';

export interface State {
  budget: BudgetState;
  user: UserState;
  income: IncomeState;
  expenses: ExpensesState;
  status: StatusState;
}

export const reducers: ActionReducerMap<State> = {
  budget: budgetReducer,
  user: userReducer,
  income: incomeReducer,
  expenses: expensesReducer,
  status: statusReducer,
};
