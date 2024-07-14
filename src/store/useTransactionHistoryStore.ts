import { create } from 'zustand';
import { ITransactionsResponse } from '@/types/wallet';

export interface TrasactionHistoryStore {
  transactions: ITransactionsResponse;
  page: number;
  type: 'fiat' | 'crypto';
  txid?: string;
  operation?: 'deposit' | 'withdraw';
  from_date?: string;
  to_date?: string;
  currency_id?: number;
  status?: '-1' | '0' | '1';
  set_transactions: (data: ITransactionsResponse) => void;
  set_page: (page: number) => void;
  set_type: (type: 'fiat' | 'crypto') => void;
  set_txid: (txid?: string) => void;
  setOperation: (type: 'deposit' | 'withdraw') => void;
  set_from_date: (date?: string) => void;
  set_to_date: (date?: string) => void;
  set_currency_id: (id?: number) => void;
  set_status: (status: '-1' | '0' | '1') => void;
  resetFilters: () => void;
}

const useTrasactionHistoryStore = create<TrasactionHistoryStore>()((set) => ({
  transactions: {
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
  },
  set_transactions: (transactions) => {
    set({ transactions });
  },
  page: 1,
  set_page: (page) => {
    set({ page });
  },
  txid: undefined,
  set_txid: (txid) => {
    set({ txid });
  },
  type: 'crypto',
  set_type: (type) => {
    set({ type });
  },
  operation: 'deposit',
  setOperation: (operation) => {
    set({ operation });
  },
  from_date: undefined,
  set_from_date: (from_date) => {
    set({ from_date });
  },
  to_date: undefined,
  set_to_date: (to_date) => {
    set({ to_date });
  },
  currency_id: undefined,
  set_currency_id: (currency_id) => {
    set({ currency_id });
  },
  status: undefined,
  set_status: (status) => {
    set({ status });
  },
  resetFilters: () => {
    set({
      page: 1,
      operation: 'deposit',
      from_date: undefined,
      txid: undefined,
      to_date: undefined,
      currency_id: undefined,
      status: undefined,
    });
  },
}));

export default useTrasactionHistoryStore;
