import { AnnouncementsContentResponse } from '@/requests/announcements';
import { create } from 'zustand';

export interface AnnouncementContent {
  title: string;
  icon?: React.ReactNode;
  important?: boolean;
  date: string;
  is_pin?: boolean;
  description: string;
  categories?: AnnouncementsContentResponse['data'][number]['attributes']['announcement_cats']['data'];
  id: string;
  slug: string;
}

interface Store {
  announcementDetails: (AnnouncementContent & { category?: string }) | null;
  setAnnouncementDetails: (
    val: (AnnouncementContent & { category?: string }) | null,
  ) => void;
}

const useAnnouncementsStore = create<Store>()((set) => ({
  announcementDetails: null,
  setAnnouncementDetails(val) {
    set({ announcementDetails: val });
  },
}));

export default useAnnouncementsStore;
