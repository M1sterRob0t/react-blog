import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { getUserInfo } from '../../userInfo';
import type { TNewUserRequest, TUserInfo, TNewUser, TUserLoginRequest, TUserEditRequest } from '../../../types/users';
import { BASE_URL, Endpoint, errorToastConfig, successToastConfig } from '../../../constants';

import { setErrorAction } from './userReducer';

export const postNewUser = createAsyncThunk('user/postNewUser', async (newUser: TNewUserRequest, { dispatch }) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(newUser),
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Users}`, options);
  const data = await response.json();

  if (response.status === 200) {
    const user: TUserInfo = data.user;
    toast('Your registration was successful!', successToastConfig);
    dispatch(setErrorAction(null));
    return user;
  } else if (response.status === 422) {
    const error: TNewUser = {
      username: data.errors.username || '',
      email: data.errors.email || '',
      password: data.errors.password || '',
    };

    dispatch(setErrorAction(error));
    return Promise.reject();
  } else {
    const errorMessage = `Status: ${response.status}. ${response.statusText}`;
    toast(errorMessage, errorToastConfig);
    return Promise.reject();
  }
});

export const requireLogin = createAsyncThunk('user/requireLogin', async (user: TUserLoginRequest) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(user),
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Login}`, options);
  const data = await response.json();

  if (response.status === 200) {
    const user: TUserInfo = data.user;
    toast('You have successfully logged in!', successToastConfig);
    return user;
  } else {
    const errorMessage = `Status: ${response.status}. ${response.statusText}`;
    toast(errorMessage, errorToastConfig);
    return Promise.reject();
  }
});

export const postUpdatedUser = createAsyncThunk(
  'user/postUpdatedUser',
  async (updatedUser: TUserEditRequest, { dispatch }) => {
    const authToken = getUserInfo().token;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${authToken}`,
        accept: 'application/json',
      },
      body: JSON.stringify(updatedUser),
    };

    const response = await fetch(`${BASE_URL}${Endpoint.User}`, options);
    const data = await response.json();

    if (response.status === 200) {
      const user: TUserInfo = data.user;
      toast('Successfully updated!', successToastConfig);
      dispatch(setErrorAction(null));
      return user;
    } else if (response.status === 422) {
      const error: TNewUser = {
        username: data.errors.username || '',
        email: data.errors.email || '',
        password: data.errors.password || '',
      };

      dispatch(setErrorAction(error));
      return Promise.reject();
    } else {
      const errorMessage = `Status: ${response.status}. ${data.errors.message}.`;
      toast(errorMessage, errorToastConfig);
      return Promise.reject();
    }
  }
);
