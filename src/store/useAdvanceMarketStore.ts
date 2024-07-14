import { create } from 'zustand';

export interface AdvanceMarketStore {
  page: number;
  per_page: number;
  total: number;
  search?: string;
  show_search_input?: boolean;
  set_page: (page: number) => void;
  set_per_page: (per_page: number) => void;
  set_total: (total: number) => void;
  set_search: (category_id: string | undefined) => void;
  set_show_search_input: (state: boolean) => void;
  reset: () => void;
}

const useAdvanceMarketStore = create<AdvanceMarketStore>()((set) => ({
  page: 1,
  set_page: (page) => {
    set({ page });
  },
  per_page: 10,
  set_per_page: (per_page) => {
    set({ per_page });
  },
  total: 1,
  set_total: (total) => {
    set({ total });
  },
  search: undefined,
  set_search: (search) => {
    set({ search });
  },
  show_search_input: false,
  set_show_search_input: (show_search_input) => {
    set({ show_search_input });
  },
  reset: () => {
    set({ search: undefined, page: 1, per_page: 10, total: 1 });
  },
}));

export default useAdvanceMarketStore;
