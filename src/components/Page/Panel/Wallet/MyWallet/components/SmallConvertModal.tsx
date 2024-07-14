import React from 'react';
import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import SmallConvertContent from './SmallConvertContent';
import { useLang } from '@/hooks';

export const smallConvertModalName = 'small-convert-modal';
const SmallConvertModal = () => {
  const [wallet] = useLang(['wallet']);

  const { closeModal } = useModal(smallConvertModalName);

  return (
    <>
      <Modal
        noTransition
        name={smallConvertModalName}
        onClose={closeModal}
        hasCloseAction={false}
        contentAddtionalClassNames="!pt-8"
        title={wallet.convertSmallAssets}
        fullScreen
      >
        <SmallConvertContent />
      </Modal>
    </>
  );
};

export default SmallConvertModal;
