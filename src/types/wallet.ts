export interface ICard {
  icon: string;
  name: string;
}
export interface ICardAction {
  icon: string;
  iconClassName: string;
  title: string;
  className: string;
}

export interface ICardFormModel {
  card_number?: string;
  iban?: string;
}

export interface IIbanFormModel {
  iban?: string;
}

export type ILogo = Record<string, string>;

export interface IResponseCard {
  id: number;
  card_number: string;
  owners: string[];
  status: string;
  is_default: number;
  icon?: string;
  iban: {
    id: number;
    withdraw_available_amount: null;
    iban: string;
    owners: string[];
    bank_name: string;
    status: string;
    is_default: number;
    bank_details: {
      code: string;
      label: string;
    };
  };
}
export interface IResponseIban {
  id: number;
  withdraw_available_amount: any;
  iban: string;
  owners: string[];
  bank_name: string;
  status: string;
  is_default: 1;
  bank_details: {
    code: string;
    label: string;
  };
}

type BalanceHistoryModel = { IRT: string; USDT: string; BTC: string };

export type BalanceHistoryTopModel = {
  title: string;
  symbol: string;
  percentage: number;
  totalUSDT: number;
  balance: number;
};

export interface IBalanceHistoryResponse {
  total: BalanceHistoryModel;
  available: BalanceHistoryModel;
  perDay: Record<string, BalanceHistoryModel>;
  top_wallets: BalanceHistoryTopModel[];
}

type BalanceDetailCoinModel = {
  baseMarketName: string;
  changePercentage: string;
  estimatedValue: string;
  last24HoursEstimatedValueChange: string;
} | null;
export interface IBalanceDetail {
  symbol: string;
  balance: string;
  balance_freeze: string;
  balance_available: string;
  balance_decimal: number;
  stats: {
    BTC: BalanceDetailCoinModel;
    USDT: BalanceDetailCoinModel;
    IRT: BalanceDetailCoinModel;
  };
}

export type NetworkModel = {
  address_explorer: string;
  address_regex: string;
  deposit_type: string;
  extra_data: string;
  has_tag: boolean;
  has_token: boolean;
  is_depositable: boolean;
  is_withdrawable: boolean;
  main_coin_decimal: number;
  main_coin_symbol: string;
  memo_regex: string;
  min_deposit: number;
  deposit_fee: string;
  min_withdrawal: number;
  max_withdrawal: number;
  p_id: number;
  pb_id: number;
  slug: string;
  smallest_unit_name: string;
  title: string;
  tx_explorer: string;
  is_selectable: boolean;
  withdrawal_fee: string;
  withdraw_decimals: string;
};

export type BalanceCoinModel = {
  currency_id: string;
  symbol: string;
  currency_png_icon: string;
  title: string;
  is_fiat: number;
  balance_decimal: number;
  balance: string;
  balance_freeze: string;
  balance_available: string;
  estimated_usdt: string;
  is_depositable: boolean;
  is_withdrawable: boolean;
  otc_tradeable: boolean;
  p2p_tradeable: boolean;
  p2p_pair: string;
  position: number;
  networks?: Record<string, NetworkModel>;
  slug: string;
};

export interface BalancePagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: {
    next: string;
  };
}
export interface IBalancesResponse {
  result: BalanceCoinModel[];
  pagination: BalancePagination;
  code: number;
  success: boolean;
  message: string;
}

export interface ITransactionsResponse {
  result: any[];
  pagination: IPagination;
  code: number;
  success: boolean;
  message: string;
}

export interface DepositAddressModel {
  deposit_address: string;
  deposit_tag: string;
  address_type: string;
  expired_at: string;
}

export interface PostDepositModel {
  transaction_id: string;
}

export interface CryptoWithdrawSubmitResultModel {
  status: boolean;
  type: 'sms' | 'email' | 'google2fa';
  channel: string;
}

export interface CryptoWithdrawOtpResultModel {
  transaction_id: string;
}

export interface CryptoWithdrawIntenalSubmitResultModel {
  status: boolean;
  type: 'sms' | 'email' | 'google2fa';
  channel: string;
}

export interface CryptoWithdrawIntenalOtpResultModel {
  transaction_id: string;
}
export interface IPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: {
    next: string | null;
  };
}

export interface IPaginationBaseModel {
  page?: number;
  per_page: number;
}

export interface IUserLimitations {
  messages: {
    additional_data: {
      user_current_fiat_deposit: string;
      user_current_fiat_withdraw: string;
      user_current_crypto_deposit: string;
      user_current_crypto_withdraw: string;
    };
    limitations: {
      fiat: {
        deposit: {
          status: boolean;
          text: string;
          value: string;
          reason: string;
        };
        id_payment: {
          status: boolean;
          text: string;
          value: string;
          reason: string;
        };
        withdraw: {
          status: boolean;
          text: string;
          value: string;
          reason: string;
        };
      };
      crypto: {
        deposit: {
          status: boolean;
          text: string;
          value: string;
          reason: string;
        };
        withdraw: {
          status: boolean;
          text: string;
          value: string;
          reason: string;
        };
      };
    };
  };
}

export interface IFiatIdDepositInfoResult {
  payment_id: string;
  bank_account: {
    id: string;
    owner: string;
    bank_name: string;
    account_number: string;
    iban: string;
    status: boolean;
  };
}

export interface ITransactionDetails {
  id: string;
  operation: 'withdraw' | 'deposit';
  currency_symbol: string;
  currency_title: string;
  network: string;
  txid: string;
  address: string;
  tag: string;
  amount: string;
  amount_type: -1;
  'iban/card': string;
  status: 0 | 1;
  reference_number: string;
  fee: string;
  is_id_payment: boolean;
  created_at: string;
  confirmed_at: string;
  ticket_id: string;
  is_internal: boolean;
  ticket_default_subject_id: number;
  ticket_department_id: number;
}

export interface ISmallAssetItem {
  currency_id: number;
  symbol: string;
  title: string;
  balance_available: number;
  estimated_usdt: number;
  estimated_irt: number;
}

export interface ISmallAssetsResult {
  commission_percent: number;
  min_conversion_usdt: number;
  min_conversion_irt: number;
  assets: ISmallAssetItem[];
}

export interface ICurrencyTransaction {
  id: number;
  label: string;
  amount: number;
  amount_type: 1 | -1;
  date: string;
}

export interface ICoinCategoriesResponse {
  result: any[];
  code: number;
  success: boolean;
  message: string;
}

export interface IAdvanceMarkeResponse {
  result: Array<Record<string, IAdvanceMarketpair>>;
  pagination: IPagination;
  code: number;
  success: boolean;
  message: string;
}

export interface IPairsResponse {
  result: Array<Record<string, ISinglePair>>;
  pagination: IPagination;
  code: number;
  success: boolean;
  message: string;
}

export interface IAdvanceMarketpair {
  pair_id: number;
  pair: string;
  baseAsset: string;
  baseAssetPrecision: string;
  quoteAsset: string;
  quotePrecision: string;
  faName: string;
  enName: string;
  faBaseAsset?: string;
  enBaseAsset: string;
  faQuoteAsset: string;
  enQuoteAsset: string;
  stepSize: number;
  tickSize: string;
  minQty: number;
  maxQty: number;
  minNotional: string;
  maxNotional: string;
  stats: {
    '24h_ch': number;
    lastPrice: number;
    lastPriceUsd: number;
    '24h_lowPrice': number;
    '24h_highPrice': number;
    '24h_volume'?: number;
    '7d_change'?: number;
    in_usd?: string;
  };
  buyStatus: boolean;
  sellStatus: boolean;
  exchangeStatus: boolean;
  createdAt: string;
  isNew: boolean;
  isZeroFee: boolean;
  favorite: boolean;
  baseAssetSlug: string;
  quoteAssetSlug: string;
}
export interface ISinglePair {
  exchange: ISinglePairExchange;
  otc: ISinglePairOTC;
}

export interface ISinglePairOTC {
  pair_id: number;
  pair: string;
  baseAsset: string;
  baseAssetPrecision: string;
  quoteAsset: string;
  quotePrecision: string;
  faName: string;
  enName: string;
  faBaseAsset?: string;
  enBaseAsset: string;
  faQuoteAsset: string;
  enQuoteAsset: string;
  stepSize: number;
  tickSize: string;
  minQty: number;
  maxQty: number;
  minNotional: string;
  maxNotional: string;
  stats: {
    '24h_ch': number;
    lastPrice: number;
    lastPriceUsd: number;
    '24h_lowPrice': number;
    '24h_highPrice': number;
  };
  buyStatus: boolean;
  sellStatus: boolean;
  exchangeStatus: boolean;
  createdAt: string;
  isNew: boolean;
  isZeroFee: boolean;
  favorite: boolean;
}
export interface ISinglePairExchange {
  pair_id: number;
  pair: string;
  baseAsset: string;
  baseAssetPrecision: string;
  quoteAsset: string;
  quotePrecision: string;
  faName: string;
  enName: string;
  faBaseAsset?: string;
  enBaseAsset: string;
  faQuoteAsset: string;
  enQuoteAsset: string;
  stepSize: number;
  tickSize: string;
  minQty: number;
  maxQty: number;
  minNotional: string;
  maxNotional: string;
  stats: {
    '24h_ch': number;
    lastPrice: number;
    lastPriceUsd: number;
    '24h_lowPrice': number;
    '24h_highPrice': number;
  };
  buyStatus: boolean;
  sellStatus: boolean;
  exchangeStatus: boolean;
  createdAt: string;
  isNew: boolean;
  isZeroFee: boolean;
  favorite: boolean;
}
