import { create } from 'zustand';
import { type NetworkModel, type BalanceCoinModel } from '@/types/wallet';

interface DepositStore {
  selectedCoin?: BalanceCoinModel;
  selectedNetwork?: NetworkModel;
  depositValue?: string;
  txid?: string;
  address?: string;
  tag?: string;
  transactionId?: string;
  expiredAt?: string;
  setSelectedCoin: (coin: BalanceCoinModel | undefined) => void;
  setSelectedNetwork: (network: NetworkModel | undefined) => void;
  setDepositValue: (value: string | undefined) => void;
  setTxid: (txid: string | undefined) => void;
  setAddress: (address: string | undefined) => void;
  setTag: (tag: string | undefined) => void;
  setTransactionId: (transactionId: string | undefined) => void;
  setExpiredAt: (expiredAt: string | undefined) => void;
  resetState: () => void;
}

const initialState = {
  selectedCoin: undefined,
  selectedNetwork: undefined,
  depositValue: undefined,
  txid: undefined,
  address: undefined,
  tag: undefined,
  transactionId: undefined,
  expiredAt: undefined,
};

const useDepositStore = create<DepositStore>()((set) => ({
  ...initialState,
  setSelectedCoin: (coin) => {
    set({ selectedCoin: coin });
  },
  setSelectedNetwork: (network) => {
    set({ selectedNetwork: network });
  },
  setDepositValue: (value) => {
    set({ depositValue: value });
  },
  setTxid: (txid) => {
    set({ txid });
  },
  setAddress: (address) => {
    set({ address });
  },
  setTag: (tag) => {
    set({ tag });
  },
  setTransactionId: (transactionId) => {
    set({ transactionId });
  },
  setExpiredAt: (expiredAt) => {
    set({ expiredAt });
  },
  resetState: () => {
    set(initialState);
  },
}));

export default useDepositStore;
