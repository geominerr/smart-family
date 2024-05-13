import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Expense,
  ExpenseCreateDto,
  ExpenseUpdateDto,
} from '@app/shared/models/expense.model';

export const ExpensesActions = createActionGroup({
  source: 'Expenses',
  events: {
    'Set All Expenses': props<{ expenses: Expense[] }>(),
    'Create Expense': props<{ dto: ExpenseCreateDto }>(),
    'Create Expense Success': props<Expense>(),
    'Create Expense Failure': props<{ error: unknown }>(),
    'Get Expense': props<{ id: string }>(),
    'Get Expense Success': props<Expense>(),
    'Get Expense Failure': props<{ error: unknown }>(),
    'Update Expense': props<{ id: string; dto: ExpenseUpdateDto }>(),
    'Update Expense Success': props<Expense>(),
    'Update Expense Failure': props<{ error: unknown }>(),
    'Delete Expense': props<{ id: string }>(),
    'Delete Expense Success': emptyProps(),
    'Delete Expense Failure': props<{ error: unknown }>(),
  },
});
