import React from 'react';
import { Modal } from '@/components/Common';
import WalletMenuContent from '@/components/Header/WalletMenu/WalletMenuContent';
import { useModal } from '@/hooks/useModal';

export const walletMenuModalName = 'wallet-menu-modal';
const WalletMenuModal = () => {
  const { closeSyncModal } = useModal(walletMenuModalName);
  return (
    <Modal
      sync
      name={walletMenuModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
    >
      <WalletMenuContent />
    </Modal>
  );
};

export default WalletMenuModal;
