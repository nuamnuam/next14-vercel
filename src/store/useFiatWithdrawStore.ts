import { IResponseIban } from '@/types/wallet';
import { create } from 'zustand';

interface FiatWithdrawStore {
  selectedIban?: IResponseIban;
  withdrawValue?: string;
  transactionId?: string;
  setSelectedIban: (iban: IResponseIban) => void;
  setWithdrawValue: (value: string) => void;
  setTransactionId: (value: string) => void;
  resetState: () => void;
}

const initialState = {
  selectedIban: undefined,
  withdrawValue: undefined,
  transactionId: undefined,
};

const useFiatWithdrawStore = create<FiatWithdrawStore>()((set) => ({
  ...initialState,
  setSelectedIban: (iban) => {
    set({ selectedIban: iban });
  },
  setWithdrawValue: (value) => {
    set({ withdrawValue: value });
  },
  setTransactionId: (value) => {
    set({ transactionId: value });
  },
  resetState: () => {
    set(initialState);
  },
}));

export default useFiatWithdrawStore;
