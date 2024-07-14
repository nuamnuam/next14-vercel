import React from 'react';
import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import InvitedContent from './InvitedContent';
import { useLang } from '@/hooks';

export const invitedModalName = 'invited-modal';
const InvitedModal = () => {
  const [referral] = useLang(['referral']);

  const { closeSyncModal } = useModal(invitedModalName);

  return (
    <Modal
      sync
      name={invitedModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      title={referral.history}
      fullScreen
    >
      <InvitedContent />
    </Modal>
  );
};

export default InvitedModal;
