import { create } from 'zustand';
import { ISmallAssetItem } from '@/types/wallet';

interface SmallAssetsStore {
  target: string;
  selectedAssets: ISmallAssetItem[];
  selectAll: boolean;
  setSelectedAssets: (val: ISmallAssetItem[]) => void;
  setTarget: (val: string) => void;
  setSelectAll: (val: boolean) => void;
  resetState: () => void;
}

const initialState = {
  target: 'USDT',
  selectAll: false,
  selectedAssets: [],
};

const useSmallAssetsStore = create<SmallAssetsStore>()((set) => ({
  ...initialState,
  setSelectedAssets: (items) => {
    set({
      selectedAssets: items,
    });
  },
  setTarget: (val) => {
    set({
      target: val,
    });
  },
  setSelectAll: (val) => {
    set({
      selectAll: val,
    });
  },
  resetState: () => {
    set(initialState);
  },
}));

export default useSmallAssetsStore;
