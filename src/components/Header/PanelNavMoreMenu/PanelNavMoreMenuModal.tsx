import React from 'react';
import { Modal } from '@/components/Common';
import PanelNavMoreMenuContent from '@/components/Header/PanelNavMoreMenu/PanelNavMoreMenuContent';
import { useModal } from '@/hooks/useModal';

export const panelNavMoreMenuModalName = 'panle-nav-more-menu-modal';
const PanelNavMoreModal = () => {
  const { closeSyncModal } = useModal(panelNavMoreMenuModalName);
  return (
    <Modal
      sync
      name={panelNavMoreMenuModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
    >
      <PanelNavMoreMenuContent />
    </Modal>
  );
};

export default PanelNavMoreModal;
