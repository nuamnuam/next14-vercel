import { create } from 'zustand';

import { IOrderHistorysResponse } from '@/types/market';
import { BalanceCoinModel } from '@/types/wallet';

const initialHistoryState = {
  result: [],
  pagination: {
    total: 0,
    count: 0,
    per_page: 0,
    current_page: 0,
    total_pages: 0,
    links: {
      next: '',
    },
  },
  code: 0,
  success: false,
  message: '',
};

export interface OrderHistoryStore {
  histories: IOrderHistorysResponse;
  page: number;
  per_page: number;
  type?: 'MARKET' | 'LIMIT';
  side?: 'BUY' | 'SELL';
  from_date?: string;
  to_date?: string;
  pair?: BalanceCoinModel;
  status?: '0' | '1';
  refetch: boolean;
  order_type?: 'OTC' | 'CONVERT' | 'P2P';
  set_histories: (data: IOrderHistorysResponse) => void;
  set_page: (page: number) => void;
  set_per_page: (per_page: number) => void;
  set_type: (type: 'MARKET' | 'LIMIT' | undefined) => void;
  set_side: (type: 'BUY' | 'SELL' | undefined) => void;
  set_from_date: (date?: string) => void;
  set_to_date: (date?: string) => void;
  set_pair: (id?: BalanceCoinModel) => void;
  set_status: (status: '0' | '1') => void;
  set_refetch: (refetch: boolean) => void;
  set_order_type: (type: 'OTC' | 'CONVERT' | 'P2P' | undefined) => void;
  resetFilters: () => void;
  resetHistories: () => void;
}

const useOrderHistoryStore = create<OrderHistoryStore>()((set) => ({
  histories: initialHistoryState,
  set_histories: (histories) => {
    set({ histories });
  },
  page: 1,
  set_page: (page) => {
    set({ page });
  },
  per_page: 5,
  set_per_page: (per_page) => {
    set({ per_page });
  },
  type: undefined,
  set_type: (type) => {
    set({ type });
  },
  side: undefined,
  set_side: (side) => {
    set({ side });
  },
  from_date: undefined,
  set_from_date: (from_date) => {
    set({ from_date });
  },
  to_date: undefined,
  set_to_date: (to_date) => {
    set({ to_date });
  },
  pair: undefined,
  set_pair: (pair) => {
    set({ pair });
  },
  status: undefined,
  set_status: (status) => {
    set({ status });
  },
  refetch: false,
  set_refetch: (refetch) => {
    set({ refetch });
  },
  order_type: undefined,
  set_order_type: (order_type) => {
    set({ order_type });
  },
  resetFilters: () => {
    set({
      page: 1,
      side: undefined,
      from_date: undefined,
      to_date: undefined,
      pair: undefined,
      refetch: false,
      order_type: undefined,
    });
  },
  resetHistories: () => {
    set({
      page: 1,
      histories: initialHistoryState,
    });
  },
}));

export default useOrderHistoryStore;
