import { BalanceCoinModel } from '@/types/wallet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BuyStore {
  totalTomanBalance?: number;
  selectedCoin?: BalanceCoinModel;
  coinValue?: number;
  tomanValue?: number;
  priceType?: 'MARKET' | 'LIMIT';
  recommendPrice?: number;
  setSelectedCoin: (coin?: BalanceCoinModel) => void;
  setCoinValue: (val: number) => void;
  setTomanValue: (val: number) => void;
  setPriceType: (type: 'MARKET' | 'LIMIT') => void;
  setRecommendPrice: (price: number) => void;
  resetState: () => void;
}

const initialState = {
  totalTomanBalance: 20000000,
  selectedCoin: undefined,
  coinValue: undefined,
  tomanValue: undefined,
  priceType: 'MARKET',
  recommendPrice: undefined,
  maxDecimal: 6,
} as Partial<BuyStore>;

const useBuyStore = create<BuyStore>()((set) => ({
  ...initialState,
  setSelectedCoin: (coin) => {
    set({ selectedCoin: coin });
  },
  setCoinValue: (val) => {
    set({ coinValue: val });
  },
  setTomanValue: (val) => {
    set({ tomanValue: Number((+val ?? 0).toFixed(0)) });
  },
  setPriceType: (val: 'MARKET' | 'LIMIT') => {
    set({ priceType: val });
  },
  setRecommendPrice: (val) => {
    set({ recommendPrice: val });
  },
  resetState: () => {
    const { selectedCoin, ...rest } = initialState;
    set(rest);
  },
}));

export default useBuyStore;
