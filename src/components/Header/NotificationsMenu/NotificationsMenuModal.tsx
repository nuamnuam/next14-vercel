import React from 'react';
import { Modal } from '@/components/Common';
import NotificationsMenuContent from '@/components/Header/NotificationsMenu/NotificationsMenuContent';
import { useModal } from '@/hooks/useModal';

export const notificationsModalName = 'notifications-modal';
const NotificationsMenuModal = () => {
  const { closeSyncModal } = useModal(notificationsModalName);
  return (
    <Modal
      sync
      name={notificationsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-0 !pt-8"
    >
      <NotificationsMenuContent />
    </Modal>
  );
};

export default NotificationsMenuModal;
