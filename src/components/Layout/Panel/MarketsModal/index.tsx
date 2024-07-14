import React from 'react';
import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import MarketsMenuContent from '@/components/Common/MarketsMenu/MarketsMenuContent';

export const marketsModalName = 'markets-modal';
const MarketsModal = () => {
  const { closeSyncModal } = useModal(marketsModalName);
  return (
    <Modal
      sync
      name={marketsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-0 !pt-8"
    >
      <MarketsMenuContent />
    </Modal>
  );
};

export default MarketsModal;
