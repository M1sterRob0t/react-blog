export type TNewUser = {
  username: string;
  email: string;
  password: string;
};

export type TNewUserRequest = {
  user: TNewUser;
};

export type TUserInfo = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: null | string;
};

export type TNewUserResponse = {
  user: TUserInfo;
};

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserLoginRequest = {
  user: TUserLogin;
};
