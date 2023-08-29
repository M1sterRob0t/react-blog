export type TNewUser = {
  user: {
    username: string;
    email: string;
    password: string;
  };
};

export type TNewUserResponse = {
  user: TUserInfo;
};

export type TUserInfo = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: null | string;
};
