export type TInvalidFieldServerErrorResponse = {
  errors: {
    email: 'string';
    username: 'string';
    password: 'string';
  };
};

export type TServerErrorResponse = {
  errors: {
    message: string;
  };
};
