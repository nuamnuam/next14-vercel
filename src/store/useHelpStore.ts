import { HelpContentResponse } from '@/requests/help';
import { create } from 'zustand';

export interface HelpContent {
  title: string;
  description: string | null;
  media: HelpContentResponse['data'][number]['attributes']['media'] | null;
}

interface Store {
  HelpDetails: HelpContent | null;
  setHelpDetails: (val: HelpContent | null) => void;
}

const useHelpStore = create<Store>()((set) => ({
  HelpDetails: null,
  setHelpDetails(val) {
    set({ HelpDetails: val });
  },
}));

export default useHelpStore;
