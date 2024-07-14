import React from 'react';
import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import DownloadAppMenuContent from './DownloadAppMenuContent';

export const downloadAppMenuModalName = 'download-app-menu-modal';
const DownloadAppMenuModal = () => {
  const { closeSyncModal } = useModal(downloadAppMenuModalName);
  return (
    <Modal
      sync
      name={downloadAppMenuModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
    >
      <DownloadAppMenuContent />
    </Modal>
  );
};

export default DownloadAppMenuModal;
