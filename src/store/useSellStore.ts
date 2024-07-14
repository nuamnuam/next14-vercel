import { create } from 'zustand';

interface SellStore {
  totalTomanBalance?: number;
  selectedCoin?: CoinModel;
  coinValue?: number;
  tomanValue?: number;
  priceType?: 'market' | 'recom';
  recommendPrice?: number;
  setSelectedCoin: (coin: CoinModel) => void;
  setCoinValue: (val: number) => void;
  setTomanValue: (val: number) => void;
  setPriceType: (type: 'market' | 'recom') => void;
  setRecommendPrice: (price: number) => void;
}

const initialState = {
  totalTomanBalance: 20000000,
  selectedCoin: undefined,
  coinValue: undefined,
  tomanValue: undefined,
  priceType: 'market',
  recommendPrice: undefined,
  maxDecimal: 6,
} as Partial<SellStore>;

const useBuyStore = create<SellStore>()((set) => ({
  ...initialState,
  setSelectedCoin: (coin) => {
    set({ selectedCoin: coin });
  },
  setCoinValue: (val) => {
    set({ coinValue: val });
  },
  setTomanValue: (val) => {
    set({ tomanValue: val });
  },
  setPriceType: (val: 'market' | 'recom') => {
    set({ priceType: val });
  },
  setRecommendPrice: (val) => {
    set({ recommendPrice: val });
  },
}));

export default useBuyStore;

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
