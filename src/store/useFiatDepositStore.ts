import { create } from 'zustand';
import { IResponseCard } from '@/types/wallet';

interface DepositStore {
  selectedCard?: IResponseCard;
  amount?: string;
  amountIsModified?: boolean;
  setSelectedCart: (coin: IResponseCard | undefined) => void;
  setAmount: (amount: string | undefined) => void;
  setAmountIsModified: (amountIsModified: boolean) => void;
  resetState: () => void;
}

const initialState = {
  selectedCard: undefined,
  amount: undefined,
  amountIsModified: false,
};

const useFiatDepositStore = create<DepositStore>()((set) => ({
  ...initialState,
  setSelectedCart: (cart) => {
    set({ selectedCard: cart });
  },
  setAmount: (amount) => {
    set({ amount });
  },
  setAmountIsModified: (amountIsModified) => {
    set({ amountIsModified });
  },
  resetState: () => {
    set(initialState);
  },
}));

export default useFiatDepositStore;
