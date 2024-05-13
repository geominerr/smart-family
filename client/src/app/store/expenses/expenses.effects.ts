import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';

import { ExpenseService } from '@app/dashboard/services/expense.service';
import { ExpensesActions } from './expenses.actions';

@Injectable()
export class ExpensesEffects {
  constructor(
    private actions$: Actions,
    private expenseService: ExpenseService
  ) {}

  createExpense$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExpensesActions.createExpense),
      switchMap((action) =>
        this.expenseService.createExpense(action.dto).pipe(
          switchMap((expense) =>
            of(ExpensesActions.createExpenseSuccess(expense))
          ),
          catchError((err) => of(ExpensesActions.createExpenseFailure(err)))
        )
      )
    );
  });

  loadExpense$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExpensesActions.getExpense),
      switchMap((action) =>
        this.expenseService.getExpense(action.id).pipe(
          switchMap((expense) =>
            of(ExpensesActions.getExpenseSuccess(expense))
          ),
          catchError((err) => of(ExpensesActions.getExpenseFailure(err)))
        )
      )
    );
  });

  updateExpense$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExpensesActions.updateExpense),
      switchMap((action) =>
        this.expenseService.updateExpense(action.id, action.dto).pipe(
          switchMap((expense) =>
            of(ExpensesActions.updateExpenseSuccess(expense))
          ),
          catchError((err) => of(ExpensesActions.updateExpenseFailure(err)))
        )
      )
    );
  });

  deleteExpense$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExpensesActions.deleteExpense),
      switchMap((action) =>
        this.expenseService.deleteExpense(action.id).pipe(
          switchMap(() => of(ExpensesActions.deleteExpenseSuccess())),
          catchError((err) => of(ExpensesActions.deleteExpenseFailure(err)))
        )
      )
    );
  });
}
