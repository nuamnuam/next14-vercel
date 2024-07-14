import { create } from 'zustand';

export interface P2POrderStoreInitalState {
  type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL';
  qty: number;
  price?: number;
  amount: number;
}

export interface P2POrderStore extends P2POrderStoreInitalState {
  set_type: (type: 'MARKET' | 'LIMIT') => void;
  set_qty: (qty: number) => void;
  set_price: (price: number) => void;
  set_amount: (amount: number) => void;
  reset: (type: 'LIMIT' | 'MARKET') => void;
}

const initialBuyState: P2POrderStoreInitalState = {
  type: 'LIMIT',
  side: 'BUY',
  qty: 0,
  price: undefined,
  amount: 0,
};

const initialSellState: P2POrderStoreInitalState = {
  type: 'LIMIT',
  side: 'SELL',
  qty: 0,
  price: undefined,
  amount: 0,
};

const useSubmitBuyP2POrderStore = create<P2POrderStore>()((set) => ({
  ...initialBuyState,
  set_type: (type) => {
    set({ type });
  },
  set_qty: (qty) => {
    set({ qty });
  },
  set_price: (price) => {
    set({ price });
  },
  set_amount: (amount) => {
    set({ amount });
  },
  reset: (type) => {
    set({ ...initialSellState, type });
  },
}));

const useSubmitSellP2POrderStore = create<P2POrderStore>()((set) => ({
  ...initialSellState,
  set_type: (type) => {
    set({ type });
  },
  set_qty: (qty) => {
    set({ qty });
  },
  set_price: (price) => {
    set({ price });
  },
  set_amount: (amount) => {
    set({ amount });
  },
  reset: (type) => {
    set({ ...initialSellState, type });
  },
}));

export { useSubmitBuyP2POrderStore, useSubmitSellP2POrderStore };
