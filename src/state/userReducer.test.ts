import type { TUserInfo } from '../types/users';
import { getUserInfo } from '../services/userInfo';

import userReducer, { removeUserAction, addUserAction } from './userReducer';

const mockUser: TUserInfo = {
  username: 'keks',
  email: 'keks@mail.ru',
  image: null,
  bio: 'I am a cat.',
  token: 'asdasd1312asdasd123123asdasd123123asdasd123123adsasd',
};

describe('userSlice', () => {
  test('should return default state when passed an empty action', () => {
    const result = userReducer({ user: null }, { type: '' });

    expect(result).toEqual({ user: null });
  });

  test('should save user data', () => {
    expect(getUserInfo()).toEqual(null);

    const action = { type: addUserAction.type, payload: mockUser };
    const result = userReducer({ user: null }, action);

    expect(result).toEqual({ user: mockUser });
    expect(getUserInfo()).toEqual(mockUser);
  });

  test('should remove user data', () => {
    expect(getUserInfo()).toEqual(mockUser);

    const action = { type: removeUserAction.type };
    const result = userReducer({ user: null }, action);

    expect(result).toEqual({ user: null });
    expect(getUserInfo()).toEqual(null);
  });
});
