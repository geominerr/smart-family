import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User, UserUpdateDto } from '@app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Get User With Budget': props<{ id: string }>(),
    'Get User': props<{ id: string }>(),
    'Get User Success': props<User>(),
    'Get User Failure': props<{ error: unknown }>(),
    'Update User': props<{ id: string; dto: UserUpdateDto }>(),
    'Update User Success': props<User>(),
    'Update User Failure': props<{ error: unknown }>(),
    'Update User BudgetId': props<{ budgetId: string }>(),
    'Delete User': props<{ id: string }>(),
    'Delete User Success': emptyProps(),
    'Delete User Failure': props<{ error: unknown }>(),
  },
});
