import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, mergeMap } from 'rxjs';

import { BudgetService } from '@app/dashboard/services/budget.service';
import { BudgetActions } from './budget.actions';
import { UserActions } from '../user/user.actions';
import { ExpensesActions } from '../expenses/expenses.actions';
import { IncomeActions } from '../income/income.actions';

@Injectable()
export class BudgetEffects {
  constructor(
    private actions$: Actions,
    private budgetService: BudgetService
  ) {}

  createDemoBudget$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BudgetActions.createDemoBudget),
      switchMap((action) =>
        this.budgetService.createDemoBudget(action.dto).pipe(
          mergeMap((budget) => [
            BudgetActions.createBudgetSuccess(budget),
            ExpensesActions.setAllExpenses({ expenses: budget.Expenses }),
            IncomeActions.setAllIncome({ income: budget.Incomes }),
            UserActions.updateUserBudgetId({ budgetId: budget.id }),
          ]),
          catchError((err) => of(BudgetActions.createDemoBudgetFailure(err)))
        )
      )
    );
  });

  createBudget$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BudgetActions.createBudget),
      switchMap((action) =>
        this.budgetService.createBudget(action.dto).pipe(
          mergeMap((budget) => [
            BudgetActions.createBudgetSuccess(budget),
            UserActions.updateUserBudgetId({ budgetId: budget.id }),
          ]),
          catchError((err) => of(BudgetActions.createBudgetFailure(err)))
        )
      )
    );
  });

  loadBudget$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BudgetActions.getBudget),
      switchMap((action) =>
        this.budgetService.getBudget(action.id).pipe(
          switchMap((budget) => of(BudgetActions.getBudgetSuccess(budget))),
          catchError((err) => of(BudgetActions.getBudgetFailure(err)))
        )
      )
    );
  });

  updateBudget$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BudgetActions.updateBudget),
      switchMap((action) =>
        this.budgetService.updateBudget(action.id, action.dto).pipe(
          switchMap((budget) => of(BudgetActions.updateBudgetSuccess(budget))),
          catchError((err) => of(BudgetActions.updateBudgetFailure(err)))
        )
      )
    );
  });

  deleteBudget$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BudgetActions.deleteBudget),
      switchMap((action) =>
        this.budgetService.deleteBudget(action.id).pipe(
          switchMap(() => of(BudgetActions.deleteBudgetSuccess())),
          catchError((err) => of(BudgetActions.deleteBudgetFailure(err)))
        )
      )
    );
  });
}
