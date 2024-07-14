import { create } from 'zustand';

interface ConvertStore {
  sourceCoin?: CoinModel;
  targetCoin?: CoinModel;
  sourceCoinValue?: number;
  targetCoinValue?: number;
  priceType?: 'market' | 'recom';
  recommendPrice?: number;
  setSourceCoin: (coin: CoinModel) => void;
  setTargetCoin: (coin: CoinModel) => void;
  setSourceCoinValue: (val: number) => void;
  setTargetCoinValue: (val: number) => void;
  setPriceType: (type: 'market' | 'recom') => void;
  setRecommendPrice: (price: number) => void;
}

const initialState = {
  sourceCoin: undefined,
  targetCoin: undefined,
  sourceCoinValue: undefined,
  targetCoinValue: undefined,
  priceType: 'market',
  recommendPrice: undefined,
} as Partial<ConvertStore>;

const useConvertStore = create<ConvertStore>()((set) => ({
  ...initialState,
  setSourceCoin: (coin) => {
    set({ sourceCoin: coin });
  },
  setTargetCoin: (coin) => {
    set({ targetCoin: coin });
  },
  setSourceCoinValue: (val) => {
    set({ sourceCoinValue: val });
  },
  setTargetCoinValue: (val) => {
    set({ targetCoinValue: val });
  },
  setPriceType: (val: 'market' | 'recom') => {
    set({ priceType: val });
  },
  setRecommendPrice: (val) => {
    set({ recommendPrice: val });
  },
}));

export default useConvertStore;

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
