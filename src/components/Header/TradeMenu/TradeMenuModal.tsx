import React from 'react';
import { Modal } from '@/components/Common';
import TradeMenuContent from './TradeMenuContent';
import { useModal } from '@/hooks/useModal';

export const tradeMenuModalName = 'trade-menu-modal';
const TradeMenuModal = () => {
  const { closeSyncModal } = useModal(tradeMenuModalName);
  return (
    <Modal
      sync
      name={tradeMenuModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-0 !pt-8"
    >
      <TradeMenuContent showHistory={false} />
    </Modal>
  );
};

export default TradeMenuModal;
