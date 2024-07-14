import { create } from 'zustand';
import { BalanceCoinModel } from '@/types/wallet';
import { persist } from 'zustand/middleware';

interface GlobalStore {
  isMaskedValue: boolean;
  userCredit?: BalanceCoinModel;
  setIsMaskedValue: () => void;
  setUserCredit: (value: BalanceCoinModel) => void;
}

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      isMaskedValue: false,
      userCredit: undefined,
      setIsMaskedValue: () => {
        set({ isMaskedValue: !get().isMaskedValue });
      },
      setUserCredit: (value) => {
        return set({ userCredit: value });
      },
    }),
    {
      name: 'global-storage',
    },
  ),
);

export default useGlobalStore;
