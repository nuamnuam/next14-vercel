export type ProfileAddress = {
  city: string;
  country: string;
  location: string;
  province: string;
  postal_code: string;
  house_number: string;
};

export type ProfilePhoneNumber = {
  area_code: string;
  main_number: string;
};

export type ProfileNotification = {
  is_enable: boolean;
  actions: {
    crypto_deposit: { is_enable: boolean; label: string };
    crypto_withdraw: { is_enable: boolean; label: string };
    fiat_deposit: { is_enable: boolean; label: string };
    fiat_withdraw: { is_enable: boolean; label: string };
    logins: { is_enable: boolean; label: string };
  };
  label: string;
};

export type ProfileStatus = {
  national_card_image: string;
  face_image: string;
  face_video: string;
  address: string;
  mobile_number: string;
  first_name: string;
  last_name: string;
  national_code: string;
  birthday: string;
  bank_card: string;
  phone_number: string;
  email: string;
};

export type ProfileSetting = {
  order_submit_confirm: boolean;
  order_delete_confirm: boolean;
  fiat_deposit: boolean;
  fiat_withdraw: boolean;
  crypto_deposit: boolean;
  crypto_withdraw: boolean;
  trade: boolean;
  theme: string;
  notifications: {
    email: boolean;
    announcement: boolean;
    push: boolean;
    sms: boolean;
  };
};

export type ProfileKyc = {
  details: {
    ['mobile-activation']: boolean;
    ['personal-info']: boolean;
    ['phone-number']: boolean;
    ['national-card-image']: boolean;
    ['face-recognition']: boolean;
    ['financial-info']: boolean;
    ['admin-approval']: boolean;
  };
  level: string;
};

export type Profile = {
  tracking_id: string;
  first_name: string;
  last_name: string;
  national_code: string;
  face_image: string;
  birthday: string;
  firebase_id: string;
  two_fa_type_id: string;
  address: ProfileAddress;
  phone_number: ProfilePhoneNumber;
  mobile_number: string;
  verification: string;
  email: string;
  invite_code: string;
  commission: ProfileCommission;
  settings: ProfileSetting;
  status: ProfileStatus;
  kyc_info: ProfileKyc;
  unread_notifications_count: string;
};

export type ProfileCommission = {
  'commission-level-name': string;
  'commission-volume': { min: string; max: string };
  'conversion-fee-discount': string;
  'dollar-equivalent-30-days': string;
  'otc-trading-fee-discount': string;
  'p2p-trading-fees': { maker: string; taker: string };
  currency_deduction: 'USDT' | 'IRT' | null;
};

export type UserStats = {
  assets_value: {
    freeze: { irt: string; usdt: string };
    total: { irt: string; usdt: string };
  };
  orders_value: {
    CONVERT: {
      open_orders: {
        count: number;
        estimate_value: { irt: string; usdt: string };
      };
      total_orders: {
        count: number;
        estimate_value: { irt: string; usdt: string };
      };
    };
    OTC: {
      open_orders: {
        count: number;
        estimate_value: { irt: string; usdt: string };
      };
      total_orders: {
        count: number;
        estimate_value: { irt: string; usdt: string };
      };
    };
    P2P: {
      open_orders: {
        count: number;
        estimate_value: { irt: string; usdt: string };
      };
      total_orders: {
        count: number;
        estimate_value: { irt: string; usdt: string };
      };
    };
  };
};
