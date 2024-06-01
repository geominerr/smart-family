import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap, mergeMap } from 'rxjs';

import { UserService } from '@app/dashboard/services/user.service';
import { BudgetService } from '@app/dashboard/services/budget.service';

import { BudgetActions } from '../budget/budget.actions';
import { IncomeActions } from '../income/income.actions';
import { ExpensesActions } from '../expenses/expenses.actions';
import { UserActions } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private budgetService: BudgetService
  ) {}

  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUser),
      switchMap((action) =>
        this.userService.getUser(action.id).pipe(
          switchMap((user) => of(UserActions.getUserSuccess(user))),
          catchError((err) => of(UserActions.getUserFailure(err)))
        )
      )
    );
  });

  loadUserWithBudget$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUserWithBudget),
      switchMap((action) =>
        this.userService.getUser(action.id).pipe(
          switchMap((user) => {
            if (!user?.budgetId) {
              return of(UserActions.getUserSuccess(user));
            }

            return this.budgetService.getBudget(user.budgetId).pipe(
              mergeMap((budget) => [
                UserActions.getUserSuccess(user),
                BudgetActions.getBudgetSuccess(budget),
                IncomeActions.setAllIncome({ income: budget.Incomes }),
                ExpensesActions.setAllExpenses({ expenses: budget.Expenses }),
              ]),
              catchError((err) => of(BudgetActions.getBudgetFailure(err)))
            );
          }),

          catchError((err) => of(UserActions.getUserFailure(err)))
        )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap((action) =>
        this.userService.updateUser(action.id, action.dto).pipe(
          switchMap((user) => of(UserActions.updateUserSuccess(user))),
          catchError((err) => of(UserActions.updateUserFailure(err)))
        )
      )
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap((action) =>
        this.userService.deleteUser(action.id).pipe(
          switchMap(() => of(UserActions.deleteUserSuccess())),
          catchError((err) => of(UserActions.deleteUserFailure(err)))
        )
      )
    );
  });
}
