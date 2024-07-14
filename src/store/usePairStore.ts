import { create } from 'zustand';

interface Store {
  quoteValue?: number;
  assetValue?: number;
  setQuoteValue: (val: number | undefined) => void;
  setAssetValue: (val: number | undefined) => void;
  resetState: (callback?: () => void) => void;
}

const initialState = {
  quoteValue: undefined,
  assetValue: undefined,
} as Partial<Store>;

const useBuyPairStore = create<Store>()((set) => ({
  ...initialState,
  setQuoteValue: (val) => {
    set({ quoteValue: val });
  },
  setAssetValue: (val) => {
    set({ assetValue: val });
  },
  resetState: (callback?: () => void) => {
    set(initialState);
    if (callback && typeof callback === 'function') {
      callback();
    }
  },
}));

const useSellPairStore = create<Store>()((set) => ({
  ...initialState,
  setQuoteValue: (val) => {
    set({ quoteValue: val });
  },
  setAssetValue: (val) => {
    set({ assetValue: val });
  },
  resetState: (callback?: () => void) => {
    set(initialState);
    if (callback && typeof callback === 'function') {
      callback();
    }
  },
}));

export { useBuyPairStore, useSellPairStore };

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
