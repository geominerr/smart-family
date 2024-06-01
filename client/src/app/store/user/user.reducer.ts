import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';

export const userFeatureKey = 'user';

export interface UserState {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  budgetId: string | undefined;
  version: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export const initialState: UserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  budgetId: undefined,
  version: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.getUserSuccess, (state, user): UserState => {
    return {
      ...state,
      ...user,
    };
  }),
  on(
    UserActions.updateUserSuccess,
    (state, user): UserState => ({
      ...state,
      ...user,
    })
  ),
  on(
    UserActions.deleteUserSuccess,
    (state): UserState => ({
      ...state,
      ...initialState,
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
