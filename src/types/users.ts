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

export type TUserResponse = {
  user: TUserInfo;
};

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserLoginRequest = {
  user: TUserLogin;
};

export type TUserEdit = {
  email?: string;
  username?: string;
  password?: string;
  image?: null | string;
};

export type TUserEditRequest = {
  user: TUserEdit;
};
