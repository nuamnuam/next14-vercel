import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Modal, SwimTab } from '@/components/Common';
import { useModal } from '@/hooks/useModal';

import {
  ResponsivePairDetail,
  Charts,
  ResponsiveOrderBook,
  RecentTrades,
} from '..';
import { useLang } from '@/hooks';

export const pairDetailModalName = 'pair-detail-modal';

type Props = {
  baseAsset: string;
  quoteAsset: string;
  slug: string;
};

const PairDetailModal: React.FC<Props> = ({ baseAsset, quoteAsset, slug }) => {
  const [market] = useLang(['market']);

  const router = useRouter();

  const [activeTab, setActiveTab] = useState('last_orders');

  const { closeModal } = useModal(pairDetailModalName);

  const navigate = () => {
    if (router.pathname.includes('panel')) {
      return router.push(`/panel/advance-trade/${baseAsset}${quoteAsset}`);
    }
    return router.push(`/advance-trade/${baseAsset}${quoteAsset}`);
  };

  const tabItems = [
    { id: 'last_orders', label: market.lastOrders },
    { id: 'orders_list', label: market.ordersList },
  ];

  return (
    <Modal
      name={pairDetailModalName}
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="md:!px-4 md:!pt-4 !px-0 !pt-0"
      headerClassNames="text-dark-600 !px-2 !py-4"
      fullScreen
      hasHelp={false}
      title={`${market.details}  ${baseAsset}/${quoteAsset}`}
      extra={
        <Button
          variant="secondary"
          onClick={() => window.open(`/${slug}`, '_blank')}
        >
          {market.about} {baseAsset}
        </Button>
      }
      footer={
        <div className="flex gap-4">
          <Button fullWidth className="flex-1" onClick={() => navigate()}>
            {market.buy} {baseAsset}
          </Button>
          <Button
            fullWidth
            className="bg-danger-500 border-danger-500 hover:bg-danger-600 focus:border-danger-600 focus:bg-danger-600 hover:border-danger-600 flex-1"
            onClick={() => navigate()}
          >
            {market.sell} {baseAsset}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <ResponsivePairDetail baseAsset={baseAsset} quoteAsset={quoteAsset} />
        <Charts baseAsset={baseAsset} quoteAsset={quoteAsset} />
        <div className="md:rounded-lg bg-white">
          <SwimTab
            items={tabItems}
            className="border-b border-dark-50"
            initial={'last_orders'}
            callback={setActiveTab}
          />
          {activeTab === 'last_orders' && (
            <ResponsiveOrderBook
              baseAsset={baseAsset}
              quoteAsset={quoteAsset}
            />
          )}
          {activeTab === 'orders_list' && (
            <RecentTrades baseAsset={baseAsset} quoteAsset={quoteAsset} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PairDetailModal;
