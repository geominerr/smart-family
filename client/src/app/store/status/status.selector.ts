import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  statusFeatureKey,
  StatusState,
} from '@app/store/status/status.reducer';

export const selectStatusStateFeature =
  createFeatureSelector<StatusState>(statusFeatureKey);

export const selectStatusState = createSelector(
  selectStatusStateFeature,
  (state: StatusState) => state
);

export const selectUpdateUserStatus = createSelector(
  selectStatusStateFeature,
  (state: StatusState) => {
    if (state.action === 'updateUserPassword') {
      return state;
    }

    return null;
  }
);
