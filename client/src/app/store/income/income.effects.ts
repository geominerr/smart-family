import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';

import { IncomeService } from '@app/dashboard/services/income.service';
import { IncomeActions } from './income.actions';

@Injectable()
export class IncomeEffects {
  constructor(
    private actions$: Actions,
    private incomeService: IncomeService
  ) {}

  createIncome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncomeActions.createIncome),
      switchMap((action) =>
        this.incomeService.createIncome(action.dto).pipe(
          switchMap((income) => of(IncomeActions.createIncomeSuccess(income))),
          catchError((err) => of(IncomeActions.createIncomeFailure(err)))
        )
      )
    );
  });

  loadIncome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncomeActions.getIncome),
      switchMap((action) =>
        this.incomeService.getIncome(action.id).pipe(
          switchMap((income) => of(IncomeActions.getIncomeSuccess(income))),
          catchError((err) => of(IncomeActions.getIncomeFailure(err)))
        )
      )
    );
  });

  updateIncome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncomeActions.updateIncome),
      switchMap((action) =>
        this.incomeService.updateIncome(action.id, action.dto).pipe(
          switchMap((income) => of(IncomeActions.updateIncomeSuccess(income))),
          catchError((err) => of(IncomeActions.updateIncomeFailure(err)))
        )
      )
    );
  });

  deleteIncome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncomeActions.deleteIncome),
      switchMap((action) =>
        this.incomeService.deleteIncome(action.id).pipe(
          switchMap(() => of(IncomeActions.deleteIncomeSuccess())),
          catchError((err) => of(IncomeActions.deleteIncomeFailure(err)))
        )
      )
    );
  });
}
