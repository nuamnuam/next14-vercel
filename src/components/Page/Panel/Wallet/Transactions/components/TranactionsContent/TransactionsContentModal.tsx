import React from 'react';

import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';

import TomanWithdrawContent from '.';
import { useLang } from '@/hooks';

interface Props {}

export const transactionsContentModalName = 'transactions-content-modal';
const TransactionsContentModal: React.FC<Props> = () => {
  const [wallet] = useLang(['wallet']);

  const { closeModal } = useModal(transactionsContentModalName);

  return (
    <Modal
      name={transactionsContentModalName}
      noTransition
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-4 !pt-4 md:!px-0 md:!pt-0"
      headerClassNames="!px-4 md:!px-8"
      fullScreen
      title={wallet.transactionsList}
    >
      <div>
        <TomanWithdrawContent />
      </div>
    </Modal>
  );
};

export default TransactionsContentModal;
