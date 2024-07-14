import React from 'react';
import { Modal, Icon, IconButton } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import PaymentResultContent from './PaymentResultContent';
import { useLang } from '@/hooks';
interface Props {}

export const modalName = 'payment-result-modal';

const PaymentResultModal: React.FC<Props> = () => {
  const [global] = useLang(['global']);

  const { closeModal } = useModal(modalName);

  return (
    <Modal
      name={modalName}
      noTransition
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-4 !pt-4 md:!px-0 md:!pt-0"
      fullScreen
      title={global.tomanDeposit}
      extra={
        <IconButton
          className="border-dark-200 text-dark-600"
          size="lg"
          icon={<Icon icon="History-OutLined" size={16} />}
        />
      }
    >
      <PaymentResultContent />
    </Modal>
  );
};

export default PaymentResultModal;
