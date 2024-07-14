import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Profile } from '@/types/profile';

interface ProfileStore {
  profile: Profile;
  setProfile: (newProfile: Profile) => void;
  reset: () => void;
}

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: {} as Profile,
      setProfile: (profile) => {
        set({ profile });
      },
      reset: () => {
        set({ profile: {} as Profile });
      },
    }),
    {
      name: 'profile-state',
    },
  ),
);
const profileAddress = useProfileStore.getState().profile?.address;
const profileSettings = useProfileStore.getState().profile?.settings;
const profileStatus = useProfileStore.getState().profile?.status;
const profileKyc = useProfileStore.getState().profile?.kyc_info;
const profilePhoneNumber = useProfileStore.getState().profile?.phone_number;

export {
  profileAddress,
  profileSettings,
  profileStatus,
  profileKyc,
  profilePhoneNumber,
};

export default useProfileStore;
