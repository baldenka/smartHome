import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

// Мемоизированные селекторы
export const selectAuth = (state: RootState) => state?.auth;
export const selectAuthLoading = createSelector(
  selectAuth,
  (auth) => auth?.loading || false
);
export const selectAuthError = createSelector(
  selectAuth,
  (auth) => auth?.error || null
);
export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth?.isAuthenticated || false
);
export const selectUser = createSelector(
  selectAuth,
  (auth) => auth?.user || null
);

export const selectError = (state: RootState) => state?.error;
export const selectLastError = createSelector(
  selectError,
  (error) => error?.lastError || null
);