export interface ISignInForm {
  email: string;
  password: string;
}

export interface ISignUpForm extends ISignInForm {
  name: string;
  surname: string;
  birthday: Date;
  gender: string;
}
