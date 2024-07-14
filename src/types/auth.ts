export type TUser = {
  email: string;
  username: string;
};

export interface RegisterModel {
  mobile_number?: string;
  referral_code?: string;
  password: string;
  captcha: string;
  captcha_key: string;
}

export interface LoginModel {
  mobile_number?: number;
  email?: string;
  device_name: string;
  password: string;
  captcha: string;
  captcha_key: string;
}

export interface CheckCodeModel {
  code: number;
  device_name: string;
  mobile_number: number;
}

export interface ResendCodeModel {
  mobile_number: number;
}

export interface ForgotPasswordModel {
  mobile_number?: number;
  email?: string;
  device_name: string;
  captcha: string;
  captcha_key: string;
}

export interface CheckOtpModel {
  mobile_number?: number;
  email?: string;
  code: number;
}

export interface TwoStepModel {
  code: string;
}

export interface ResetPasswordModel {
  password: string;
  password_confirmation: string;
}
export interface ResetPasswordForm
  extends Omit<ResetPasswordModel, 'token' & 'email'> {}
