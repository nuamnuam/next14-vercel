import { BalanceCoinModel, IAdvanceMarketpair } from '@/types/wallet';
import { create } from 'zustand';

const initialState = {
  baseAsset: 'USDT',
  quoteAsset: 'IRT',
  pair: undefined,
  quoteBalance: undefined,
  assetBalance: undefined,
  buyPrice: undefined,
  sellPrice: undefined,
};

export interface AdvanceTradeStore {
  baseAsset: string;
  quoteAsset: string;
  pair: IAdvanceMarketpair | undefined;
  quoteBalance: BalanceCoinModel | undefined;
  assetBalance: BalanceCoinModel | undefined;
  buyPrice: number | undefined;
  sellPrice: number | undefined;
  set_baseAsset: (asset: string) => void;
  set_quoteAsset: (quote: string) => void;
  set_quoteBalance: (balance: BalanceCoinModel | undefined) => void;
  set_assetBalance: (balance: BalanceCoinModel | undefined) => void;
  set_pair: (pair: IAdvanceMarketpair | undefined) => void;
  set_buyPrice: (price: number | undefined) => void;
  set_sellPrice: (price: number | undefined) => void;
  reset: () => void;
}

const useAdvanceTradeStore = create<AdvanceTradeStore>()((set) => ({
  ...initialState,
  set_baseAsset: (baseAsset) => {
    set({ baseAsset });
  },
  set_quoteAsset: (quoteAsset) => {
    set({ quoteAsset });
  },
  set_pair: (pair) => {
    set({ pair });
  },
  set_quoteBalance: (quoteBalance) => {
    set({ quoteBalance });
  },
  set_assetBalance: (assetBalance) => {
    set({ assetBalance });
  },
  set_buyPrice: (buyPrice) => {
    set({ buyPrice });
  },
  set_sellPrice: (sellPrice) => {
    set({ sellPrice });
  },
  reset: () => {
    set(initialState);
  },
}));

export default useAdvanceTradeStore;
