import { TUserInfo } from '../types/users';

const USER_INFO_KEY_NAME = 'realworld-blog-userinfo';

export const getUserInfo = (): TUserInfo => {
  const userInfo = localStorage.getItem(USER_INFO_KEY_NAME) as string;
  return JSON.parse(userInfo);
};

export const saveUserInfo = (userInfo: TUserInfo): void => {
  localStorage.setItem(USER_INFO_KEY_NAME, JSON.stringify(userInfo));
};

export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY_NAME);
};
