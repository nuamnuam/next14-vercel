export interface IId {
  id?: number;
}
export interface ICardIbanId {
  id?: number;
  iban?: string;
}
export interface IIbanId {
  iban?: string;
}
export interface ICardNumber {
  card_number?: string;
}
export interface IPhoneNumber {
  phone_number?: string;
}
export interface IPhoneNumberModel {
  area_code: string | undefined;
  main_number: string | undefined;
}
export interface IMobileNumber {
  mobile_number?: number | string;
}
export interface ICode {
  code?: string;
}
export interface IEmail {
  email?: string;
}
export interface IAddress {
  city: string;
  country?: string;
  location?: string;
  province: string;
  postal_code: string;
  house_number?: string;
  address?: string;
  plaque?: string;
}

export interface EditProfileModel {
  first_name?: string;
  last_name?: string;
  national_code?: string;
  birthday?: string;
  area_code?: string | undefined;
  main_number?: string | undefined;
  mobile_number?: string;
  email?: string;
  location?: string;
  country?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  house_number?: string;
  settings?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
    };
    order_submit_confirm?: boolean;
    order_delete_confirm?: boolean;
    currency_deduction?: 'USDT' | 'IRT' | null;
  };
}
export interface IProfileInfo {
  tracking_id: number;
  first_name: string;
  last_name: string;
  national_code: string;
  face_image: string;
  birthday: string;
  is_legal: boolean;
  address: IAddress;
  phone_number: {
    area_code: string;
    main_number: string;
  };
  mobile_number: string;
  verification: string;
  email: string;
  invite_code: string;
  two_fa_type_id: string;
  commmission: number;
  settings: {
    order_submit_confirm: boolean;
    order_delete_confirm: boolean;
    choose_trading_type: boolean;
    coin_deposit: boolean;
    coin_withdraw: boolean;
    money_deposit: boolean;
    logins: boolean;
    trade: boolean;
    theme: string;
    mode: string;
    notifications: {
      email: {
        is_enable: boolean;
        actions: {
          coin_deposit: {
            is_enable: boolean;
            label: string;
          };
          coin_withdraw: {
            is_enable: boolean;
            label: string;
          };
          money_deposit: {
            is_enable: boolean;
            label: string;
          };
          money_withdraw: {
            is_enable: boolean;
            label: string;
          };
          logins: {
            is_enable: boolean;
            label: string;
          };
        };
        label: string;
      };
      announcement: {
        is_enable: boolean;
        actions: {
          coin_deposit: {
            is_enable: boolean;
            label: string;
          };
          coin_withdraw: {
            is_enable: boolean;
            label: string;
          };
          money_deposit: {
            is_enable: boolean;
            label: string;
          };
          money_withdraw: {
            is_enable: boolean;
            label: string;
          };
          logins: {
            is_enable: boolean;
            label: string;
          };
        };
        label: string;
      };
      push: {
        is_enable: boolean;
        actions: {
          coin_deposit: {
            is_enable: boolean;
            label: string;
          };
          coin_withdraw: {
            is_enable: boolean;
            label: string;
          };
          money_deposit: {
            is_enable: boolean;
            label: string;
          };
          money_withdraw: {
            is_enable: boolean;
            label: string;
          };
          logins: {
            is_enable: boolean;
            label: string;
          };
        };
        label: string;
      };
    };
  };
  status: {
    first_name: string;
    last_name: string;
    national_code: string;
    national_card_image: string;
    face_image: string;
    face_video: string;
    birthday: string;
    address: string;
    phone_number: string;
    mobile_number: string;
    email: string;
    bank_card?: string;
  };
  kyc_info: {
    details: {
      'mobile-activation'?: boolean;
      'personal-info': boolean;
      'financial-info': boolean;
      'phone-number': boolean;
      'national-card-image'?: boolean;
      'national-card'?: boolean;
      'face-recognition'?: boolean;
      'admin-approval'?: boolean | null;
    };
    level: number | string;
  };
}
export interface IChangeModal {
  mobile_number?: string;
}

export type ILinkedDevice = {
  classNames?: string;
  icon: string;
  align?: 'right' | 'left' | 'inherit' | 'center' | 'justify';
  actions?: any;
  agent?: string;
  action_type_text?: string;
  created_at?: number;
  action_type?: string;
  device?: string;
  id?: string;
  ip?: string;
  status?: false;
};
export type IActivity = {
  id?: string;
  align?: 'right' | 'left' | 'inherit' | 'center' | 'justify';
  actions?: any;
  device?: string;
  ip?: string;
  agent?: string;
  action_type_text?: string;
  created_at?: number;
  action_type?: string;
  status?: boolean;
};
export interface ICardImageModel {
  national_card_image?: string | Blob;
}
export interface IChangePasswordModel {
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}
export interface IChangePasswordCheckOTPModel {
  code?: string;
}
export interface IChangePasswordGetOTPModel {
  two_step?: string;
}

export interface ISetDefaultCardIban {
  'card-number-id'?: number;
}
