import { create } from 'zustand';
import {
  type IBalancesResponse,
  type IBalanceDetail,
  type IBalanceHistoryResponse,
} from '@/types/wallet';

interface WalletBalanceStore {
  balances: IBalancesResponse;
  setBalances: (newProfile: IBalancesResponse) => void;
  balancesPage: number;
  setBalancesPage: (page: number) => void;
  balancesSearchVal?: string;
  setBalancesSearchVal: (val: string) => void;
  nonZeroBalances: boolean;
  setNonZeroBalances: (val: boolean) => void;
  balanceHistory: IBalanceHistoryResponse;
  setBalanceHistory: (newProfile: IBalanceHistoryResponse) => void;
  balanceDetail: IBalanceDetail;
  setBalanceDetail: (newProfile: IBalanceDetail) => void;
  resetState: () => void;
}

const useWalletBalanceStore = create<WalletBalanceStore>()((set, get) => ({
  balances: {
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
  setBalances: (balances) => {
    set({ balances });
  },
  balancesPage: 1,
  setBalancesPage: (page) => {
    set({ balancesPage: page });
  },
  nonZeroBalances: false,
  setNonZeroBalances: (val) => {
    set({ nonZeroBalances: val, balancesPage: 1 });
  },
  balancesSearchVal: undefined,
  setBalancesSearchVal: (val) => {
    set({ balancesSearchVal: val, balancesPage: 1 });
  },
  balanceHistory: {} as IBalanceHistoryResponse,
  setBalanceHistory: (balanceHistory) => {
    set({ balanceHistory });
  },
  balanceDetail: {} as IBalanceDetail,
  setBalanceDetail: (balanceDetail) => {
    set({ balanceDetail });
  },
  resetState: () => {
    set({
      balances: {
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
      balancesPage: 1,
      nonZeroBalances: false,
      balancesSearchVal: undefined,
      balanceHistory: {} as IBalanceHistoryResponse,
      balanceDetail: {} as IBalanceDetail,
    });
  },
}));

export default useWalletBalanceStore;
