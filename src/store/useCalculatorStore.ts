import { create } from 'zustand';

import { ICurrencyModel } from '@/types/currency';

interface Store {
  quote?: ICurrencyModel;
  asset?: ICurrencyModel;
  quoteValue?: number;
  assetValue?: number;
  setQuote: (coin: ICurrencyModel) => void;
  setAsset: (coin: ICurrencyModel) => void;
  setQuoteValue: (val: number) => void;
  setAssetValue: (val: number) => void;
  resetState: (callback?: () => void) => void;
}

const FIAT_SCHEMA: ICurrencyModel = {
  balance_decimal: '0',
  currency_id: 1,
  otc_tradeable: true,
  p2p_tradeable: true,
  position: 1,
  price_decimal: '12',
  symbol: 'IRT',
  title: 'تومان',
  is_depositable: true,
  is_fiat: true,
  is_withdrawable: true,
};

const BTC_SCHEMA: ICurrencyModel = {
  balance_decimal: '6',
  currency_id: 258,
  is_depositable: true,
  is_fiat: false,
  is_withdrawable: true,
  otc_tradeable: true,
  p2p_tradeable: true,
  position: 10,
  price_decimal: '1',
  symbol: 'BTC',
  title: 'بیت کوین',
};

const initialState = {
  quote: FIAT_SCHEMA,
  asset: BTC_SCHEMA,
  quoteValue: undefined,
  assetValue: undefined,
} as Partial<Store>;

const useCalculatorStore = create<Store>()((set) => ({
  ...initialState,
  setQuote: (coin) => {
    set({ quote: coin });
  },
  setAsset: (coin) => {
    set({ asset: coin });
  },
  setQuoteValue: (val) => {
    set({ quoteValue: val });
  },
  setAssetValue: (val) => {
    set({ assetValue: val });
  },
  resetState: (callback?: () => void) => {
    const { quote, asset, ...rest } = initialState;
    set({ ...rest });
    if (callback && typeof callback === 'function') {
      callback();
    }
  },
}));

export default useCalculatorStore;
