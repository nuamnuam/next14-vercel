import { create } from 'zustand';
import { type NetworkModel, type BalanceCoinModel } from '@/types/wallet';

interface CryptoWithdrawStore {
  withdrawType: string;
  selectedCoin?: BalanceCoinModel;
  selectedNetwork?: NetworkModel;
  withdrawValue?: string;
  mobileNumber?: string;
  address?: string;
  tag?: string;
  setWithdrawType: (type: string) => void;
  setSelectedCoin: (coin: BalanceCoinModel | undefined) => void;
  setSelectedNetwork: (network: NetworkModel | undefined) => void;
  setWithdrawValue: (value: string | undefined) => void;
  setMobileNumber: (mobile: string | undefined) => void;
  setAddress: (address: string | undefined) => void;
  setTag: (tag: string | undefined) => void;
  resetState: () => void;
}

const initialState = {
  withdrawType: 'external',
  selectedCoin: undefined,
  selectedNetwork: undefined,
  withdrawValue: undefined,
  address: undefined,
  tag: undefined,
};

const useCryptoWithdrawStore = create<CryptoWithdrawStore>()((set) => ({
  ...initialState,
  setWithdrawType: (type) => {
    set({
      withdrawValue: undefined,
      selectedNetwork: undefined,
      tag: undefined,
      address: undefined,
      mobileNumber: undefined,
      withdrawType: type,
    });
  },
  setSelectedCoin: (coin) => {
    set({
      selectedNetwork: undefined,
      withdrawValue: undefined,
      address: undefined,
      tag: undefined,
      mobileNumber: undefined,
      selectedCoin: coin,
    });
  },
  setSelectedNetwork: (network) => {
    set({ selectedNetwork: network });
  },
  setWithdrawValue: (value) => {
    set({ withdrawValue: value });
  },
  setMobileNumber: (value) => {
    set({ mobileNumber: value });
  },
  setAddress: (address) => {
    set({ address });
  },
  setTag: (tag) => {
    set({ tag });
  },
  resetState: () => {
    set(initialState);
  },
}));

export default useCryptoWithdrawStore;
