import { NgModule, isDevMode } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers } from './index';
import { BudgetEffects } from './budget/budget.effects';
import { ExpensesEffects } from './expenses/expenses.effects';
import { IncomeEffects } from './income/income.effects';
import { UserEffects } from './user/user.effects';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(
      BudgetEffects,
      ExpensesEffects,
      IncomeEffects,
      UserEffects
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
})
export class StoreAppModule {}
