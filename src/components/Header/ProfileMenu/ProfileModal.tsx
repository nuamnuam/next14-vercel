import React from 'react';
import { Modal } from '@/components/Common';
import ProfileMenuContent from '@/components/Header/ProfileMenu/ProfileMenuContent';
import { useModal } from '@/hooks/useModal';

export const profileModalName = 'profile-modal';
const ProfileModal = () => {
  const { closeSyncModal } = useModal(profileModalName);
  return (
    <Modal
      sync
      name={profileModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-0 !pt-8"
    >
      <ProfileMenuContent />
    </Modal>
  );
};

export default ProfileModal;
