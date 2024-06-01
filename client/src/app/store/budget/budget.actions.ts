import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Budget,
  BudgetCreateDto,
  BudgetDemoCreateDto,
  BudgetUpdateDto,
} from '@app/shared/models/budget.model';

export const BudgetActions = createActionGroup({
  source: 'Budget',
  events: {
    'Create Demo Budget': props<{ dto: BudgetDemoCreateDto }>(),
    'Create Demo Budget Success': props<Budget>(),
    'Create Demo Budget Failure': props<{ error: unknown }>(),
    'Create Budget': props<{ dto: BudgetCreateDto }>(),
    'Create Budget Success': props<Budget>(),
    'Create Budget Failure': props<{ error: unknown }>(),
    'Get Budget': props<{ id: string }>(),
    'Get Budget Success': props<Budget>(),
    'Get Budget Failure': props<{ error: unknown }>(),
    'Update Budget': props<{ id: string; dto: BudgetUpdateDto }>(),
    'Update Budget Success': props<Budget>(),
    'Update Budget Failure': props<{ error: unknown }>(),
    'Delete Budget': props<{ id: string }>(),
    'Delete Budget Success': emptyProps(),
    'Delete Budget Failure': props<{ error: unknown }>(),
  },
});
