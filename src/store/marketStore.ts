import { create } from 'zustand';

import type { IAdvanceMarkeResponse } from '@/types/wallet';
import { SuccussCoinCategoriesResponse } from '@/requests/market/coinCategoriesMutation';

const initialState: Partial<MarketStore> = {
  category_id: 'all',
  sort_by: undefined,
  sort_type: undefined,
};

const initialPairState: IAdvanceMarkeResponse = {
  result: [],
  code: 0,
  success: false,
  message: '',
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
};

export interface MarketStore {
  coin_categories: SuccussCoinCategoriesResponse;
  pairs: IAdvanceMarkeResponse;
  page: number;
  per_page: number;
  favorite?: boolean;
  sort_by?: string;
  sort_type?: 'ASC' | 'DESC';
  category_id?: number | string;
  search?: string;
  isLoading: boolean;
  show_search_input: boolean;
  set_coin_categories: (data: SuccussCoinCategoriesResponse) => void;
  set_pairs: (data: IAdvanceMarkeResponse) => void;
  set_page: (page: number) => void;
  set_favorite: (favorite: boolean) => void;
  set_sort_by: (sort_by: string | undefined) => void;
  set_sort_type: (sort_type: 'ASC' | 'DESC' | undefined) => void;
  set_per_page: (per_page: number) => void;
  set_category_id: (category_id: number | string | undefined) => void;
  set_search: (category_id: string | undefined) => void;
  set_loading: (loading: boolean) => void;
  set_show_search_input: (status: boolean) => void;
  reset_pairs: () => void;
  reset: () => void;
  resetSorting: () => void;
}

const useMarketStore = create<MarketStore>()((set) => ({
  coin_categories: {
    result: [],
    code: 0,
    success: false,
    message: '',
  },
  pairs: initialPairState,
  set_coin_categories: (coin_categories) => {
    set({ coin_categories });
  },
  set_pairs: (pairs) => {
    set({ pairs });
  },
  page: 1,
  set_page: (page) => {
    set({ page });
  },
  per_page: 10,
  set_per_page: (per_page) => {
    set({ per_page });
  },
  favorite: false,
  set_favorite: (favorite) => {
    set({ favorite });
  },
  set_sort_by: (sort_by) => {
    set({ sort_by });
  },
  set_sort_type: (sort_type) => {
    set({ sort_type });
  },
  set_category_id: (category_id) => {
    set({ category_id });
  },
  search: undefined,
  set_search: (search) => {
    set({ search });
  },
  isLoading: false,
  set_loading: (isLoading) => {
    set({ isLoading });
  },
  show_search_input: false,
  set_show_search_input: (show_search_input) => {
    set({ show_search_input });
  },
  reset_pairs: () => {
    set({ pairs: initialPairState });
  },
  ...initialState,
  reset: () => {
    set({ ...initialState });
  },
  resetSorting: () => {
    set({ ...initialState, search: undefined });
  },
}));

export default useMarketStore;
