import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Modal, SwimTab } from '@/components/Common';
import { useAdvanceTradeStore } from '@/store';
import { useModal } from '@/hooks/useModal';

import {
  ResponsivePairDetail,
  RecentTrades,
  Charts,
  ResponsiveOrderBook,
} from '..';
import { useLang } from '@/hooks';

export const advancedTradeExtraModalName = 'advanced-trade-extra-modal';

const ExtraModal: React.FC = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const router = useRouter();
  const { baseAsset, quoteAsset, pair } = useAdvanceTradeStore();

  const [activeTab, setActiveTab] = useState('last_orders');

  const { closeModal } = useModal(advancedTradeExtraModalName);

  const tabItems = [
    { id: 'last_orders', label: advancedTrade.lastOrders },
    { id: 'orders_list', label: advancedTrade.tradesList },
  ];

  return (
    <Modal
      noTransition
      name={advancedTradeExtraModalName}
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="md:!px-4 md:!pt-4 !px-0 !pt-0"
      headerClassNames="text-dark-600 !px-2 !py-4"
      fullScreen
      hasHelp={false}
      title={`${advancedTrade.details}  ${baseAsset}/${quoteAsset}`}
      extra={
        <Button
          variant="secondary"
          onClick={() => window.open(`/${pair?.baseAssetSlug}`, '_blank')}
        >
          {advancedTrade.about} {baseAsset}
        </Button>
      }
      footer={
        <div className="flex gap-4">
          <Button fullWidth className="flex-1" onClick={() => router.back()}>
            {advancedTrade.buy} {baseAsset}
          </Button>
          <Button
            fullWidth
            className="bg-danger-500 border-danger-500 hover:bg-danger-600 focus:border-danger-600 focus:bg-danger-600 hover:border-danger-600 flex-1"
            onClick={() => router.back()}
          >
            {advancedTrade.sell} {baseAsset}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <ResponsivePairDetail />
        <Charts />
        <div className="md:rounded-lg bg-white">
          <SwimTab
            items={tabItems}
            className="border-b border-dark-50"
            initial={'last_orders'}
            callback={setActiveTab}
          />
          {activeTab === 'last_orders' && <ResponsiveOrderBook />}
          {activeTab === 'orders_list' && <RecentTrades />}
        </div>
      </div>
    </Modal>
  );
};

export default ExtraModal;
