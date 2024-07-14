export type ICurrencyModel = {
  currency_id: number;
  title: string;
  symbol: string;
  position: number;
  is_fiat: boolean;
  balance_decimal: string;
  price_decimal: string;
  is_depositable: boolean;
  is_withdrawable: boolean;
  otc_tradeable: boolean;
  p2p_tradeable: boolean;
  networks?: Record<string, ICurrencyNetworkModel>;
};

export type ICurrencyNetworkModel = {
  address_explorer: string;
  address_regex: string;
  deposit_type: string;
  deposit_fee: string;
  extra_data: string;
  has_tag: boolean;
  has_token: boolean;
  is_depositable: boolean;
  is_withdrawable: boolean;
  main_coin_decimal: number;
  main_coin_symbol: string;
  memo_regex: string;
  min_deposit: number;
  min_withdrawal: number;
  p_id: number;
  pb_id: number;
  slug: string;
  smallest_unit_name: string;
  title: string;
  tx_explorer: string;
  is_selectable: boolean;
  withdrawal_fee: string;
};
