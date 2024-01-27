import { createSlice } from '@reduxjs/toolkit';
import type { Action, PayloadAction } from '@reduxjs/toolkit';

import { getUserInfo, saveUserInfo, removeUserInfo } from '../../userInfo';
import type { TNewUser, TUserInfo } from '../../../types/users';

import { postNewUser, requireLogin, postUpdatedUser } from './api-actions';

interface PendingAction extends Action {
  isLoading: true;
}

function isUserPendingAction(action: Action): action is PendingAction {
  return action.type.startsWith('user') && action.type.endsWith('pending');
}

interface RejectedAction extends Action {
  isError: true;
}

function isUserRejectedAction(action: Action): action is RejectedAction {
  return action.type.startsWith('user') && action.type.endsWith('rejected');
}

export type TUSerState = {
  isLoading: boolean;
  isError: boolean;
  isUpdated: boolean;
  user: TUserInfo | null;
  serverError: TNewUser | null;
};

const initialState: TUSerState = {
  isLoading: false,
  isError: false,
  isUpdated: false,
  user: getUserInfo(),
  serverError: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearErrorAction: (state: TUSerState) => {
      state.isError = false;
    },
    setErrorAction: (state: TUSerState, action: PayloadAction<TNewUser | null>) => {
      state.serverError = action.payload;
    },
    logoutAction: (state: TUSerState) => {
      state.user = null;
      removeUserInfo();
    },
  },
  extraReducers: (builder) => {
    builder // postNewUser
      .addCase(postNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        saveUserInfo(action.payload);
      }) // requireLogin
      .addCase(requireLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        saveUserInfo(action.payload);
      }) // postUpdatedUser
      .addCase(postUpdatedUser.fulfilled, (state, action) => {
        state.isUpdated = true;
        state.isLoading = false;
        state.user = action.payload;
        saveUserInfo(action.payload);
      })
      .addMatcher(isUserPendingAction, (state) => {
        state.isUpdated = false;
        state.isLoading = true;
      })
      .addMatcher(isUserRejectedAction, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearErrorAction, setErrorAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;
