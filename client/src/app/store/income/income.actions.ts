import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Income,
  IncomeCreateDto,
  IncomeUpdateDto,
} from '@app/shared/models/income.model';

export const IncomeActions = createActionGroup({
  source: 'Income',
  events: {
    'Set All Income': props<{ income: Income[] }>(),
    'Create Income': props<{ dto: IncomeCreateDto }>(),
    'Create Income Success': props<Income>(),
    'Create Income Failure': props<{ error: unknown }>(),
    'Get Income': props<{ id: string }>(),
    'Get Income Success': props<Income>(),
    'Get Income Failure': props<{ error: unknown }>(),
    'Update Income': props<{ id: string; dto: IncomeUpdateDto }>(),
    'Update Income Success': props<Income>(),
    'Update Income Failure': props<{ error: unknown }>(),
    'Delete Income': props<{ id: string }>(),
    'Delete Income Success': emptyProps(),
    'Delete Income Failure': props<{ error: unknown }>(),
  },
});
