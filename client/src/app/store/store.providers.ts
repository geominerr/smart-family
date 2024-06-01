import { isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { reducers } from './index';
import { BudgetEffects } from './budget/budget.effects';
import { ExpensesEffects } from './expenses/expenses.effects';
import { IncomeEffects } from './income/income.effects';
import { UserEffects } from './user/user.effects';

export const getProviderStore = () => provideStore(reducers);

export const getProviderEffects = () =>
  provideEffects(BudgetEffects, ExpensesEffects, IncomeEffects, UserEffects);

export const getProviderDevStore = () =>
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() });
