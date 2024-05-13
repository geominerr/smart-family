import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';

export const userFeatureKey = 'user';

export interface UserState {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  budgetId: string | undefined;
}

export const initialState: UserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  budgetId: undefined,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.getUserSuccess, (state, user): UserState => {
    return {
      ...state,
      id: user.id,
      username: user.username,
      email: user.email,
      budgetId: user?.budgetId,
    };
  }),
  on(
    UserActions.updateUserSuccess,
    (state, user): UserState => ({
      ...state,
      id: user.id,
      username: user.username,
      email: user.email,
    })
  ),
  on(
    UserActions.deleteUserSuccess,
    (state): UserState => ({
      ...state,
      id: undefined,
      username: undefined,
      email: undefined,
    })
  ),
  on(
    UserActions.updateUserBudgetId,
    (state, { budgetId }): UserState => ({
      ...state,
      budgetId,
    })
  )
);
