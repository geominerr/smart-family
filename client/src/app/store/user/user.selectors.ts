import { createFeatureSelector, createSelector } from '@ngrx/store';

import { userFeatureKey, UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>(userFeatureKey);

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state
);

export const selectUserId = createSelector(
  selectUserState,
  (state: UserState) => state.id
);
