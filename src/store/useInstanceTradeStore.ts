import { BalanceCoinModel } from '@/types/wallet';
import { create } from 'zustand';

interface Store {
  quote?: BalanceCoinModel;
  asset?: BalanceCoinModel;
  quoteValue?: number;
  assetValue?: number;
  priceType?: 'MARKET' | 'LIMIT';
  userPrice?: number;
  setQuote: (coin: BalanceCoinModel) => void;
  setAsset: (coin: BalanceCoinModel) => void;
  setQuoteValue: (val: number) => void;
  setAssetValue: (val: number | undefined) => void;
  setPriceType: (type: 'MARKET' | 'LIMIT') => void;
  setUserPrice: (price: number) => void;
  resetState: (callback?: () => void) => void;
}

const initialState = {
  quote: undefined,
  asset: undefined,
  quoteValue: undefined,
  assetValue: undefined,
  priceType: 'MARKET',
  userPrice: undefined,
} as Partial<Store>;

const useInstanceTradeStore = create<Store>()((set) => ({
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
  setPriceType: (val: 'MARKET' | 'LIMIT') => {
    set({ priceType: val });
  },
  setUserPrice: (val) => {
    set({ userPrice: val });
  },
  resetState: (callback?: () => void) => {
    const { quote, asset, ...rest } = initialState;
    set({ ...rest });
    if (callback && typeof callback === 'function') {
      callback();
    }
  },
}));

export default useInstanceTradeStore;

export type CoinModel = {
  title_fa: string;
  title_en: string;
  symbol: string;
  icon: string | React.ReactNode;
  totlaBalance: number;
  marketPrice?: number;
  buyFee?: number;
  discount?: number;
  maxDecimal?: number;
};
