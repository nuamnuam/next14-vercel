export type IReferralLevel = {
  level_id: number;
  level_name: number;
  level_order: number;
  level_min_limited: number;
  level_max_limited: number;
  level_earn_percent: number;
};

export type IInviteCode = {
  invited_code_id: number;
  invited_code: string;
  inviter_commission_percent: number;
  invited_commission_percent: number;
  code_usage: number;
  code_rewarded_earned_irt: number;
  code_rewarded_earned_usd: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type IReferralInfo = {
  current_level_id: number;
  invite_base_url: string;
  registration_invite_code_max_hours: string;
  max_invite_code_limit: number;
  registration_invite_code: string;
  total_rewarded_earned_irt: number;
  total_rewarded_earned_usdt: number;
  total_invited: number;
  total_invited_with_kyc: number;
  total_invited_with_deal: number;
  total_invited_deals: number;
  registration_invite_code_expired?: boolean;
};

export type IInvitedUser = {
  user_mobile_no: string;
  user_register_date: string;
  user_kyc_is_done: boolean;
  invite_code: string;
  inviter_commission_percent: number;
  invited_commission_percent: number;
  code_rewarded_earned_irt: number;
  code_rewarded_earned_usd: number;
};

export type IHighestEarning = {
  order_id: number;
  user_mobile_no: string;
  user_rewarded_earned_irt: number;
  user_rewarded_earned_usd: number;
  user_codes_usage: number;
};

export type IInviteGift = {
  gift_amount_irt: number;
  gift_amount_usd: number;
  gift_date: string;
};
