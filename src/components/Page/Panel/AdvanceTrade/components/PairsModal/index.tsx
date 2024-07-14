import React from 'react';

import { Modal } from '@/components';
import { useModal } from '@/hooks/useModal';

import Market from '../Market';
import { useLang } from '@/hooks';

export const advancedMarketPairsModalName = 'advanced-market-pairs-modal';

const PairsModal: React.FC = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const { closeSyncModal } = useModal(advancedMarketPairsModalName);

  return (
    <Modal
      sync
      name={advancedMarketPairsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
    >
      <div className="flex flex-col gap-4">
        <span className="text-dark-700 font-medium block text-center">
          {advancedTrade.selectMarket}
        </span>
        <Market closeModal={closeSyncModal} />
      </div>
    </Modal>
  );
};

export default PairsModal;
