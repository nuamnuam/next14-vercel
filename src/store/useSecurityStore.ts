import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalStore {
  selectedDeleteDevice: any;
  setselectedDeleteDevice: (selectedDeleteDevice: any) => void;
  selectedActivity?: any;
  setselectedDevice: (selectedActivity: any) => void;
}

const useSecurityStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      selectedDeleteDevice: null,
      setselectedDeleteDevice: (selectedDeleteDevice) => {
        set({ selectedDeleteDevice });
      },
      selectedActivity: null,
      setselectedDevice: (selectedActivity) => {
        set({ selectedActivity });
      },
    }),
    {
      name: 'global-storage',
    },
  ),
);

export default useSecurityStore;
