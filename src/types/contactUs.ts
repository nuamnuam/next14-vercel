export interface ContactUsFormModel {
  full_name: string;
  email: string;
  mobile: string;
  subject: string;
  description?: string;
  content: string;
  captcha: string;
  captcha_key: string;
}
