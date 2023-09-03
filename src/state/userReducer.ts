import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getUserInfo, removeUserInfo, saveUserInfo } from '../services/userInfo';
import { TUserInfo } from '../types/users';

const initialState = {
  user: getUserInfo(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    logoutAction: (state) => {
      state.user = null;
      removeUserInfo();
    },

    loginAction: (state, action: PayloadAction<TUserInfo>) => {
      state.user = action.payload;
      saveUserInfo(action.payload);
    },
  },
});

export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;
