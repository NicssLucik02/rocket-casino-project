export type FormDataType = {
  email: string;
  password: string;
  username?: string;
};

export type FormErrors = {
  email?: string;
  password?: string;
  username?: string;
  server?: string;
};
