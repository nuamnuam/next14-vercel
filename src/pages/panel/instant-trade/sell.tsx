'use client';

import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const PanelLayout = dynamic(
  async () => await import('@/components/Layout/Panel'),
  {
    ssr: false,
  },
);

const WalletFastOrderLayout = dynamic(
  async () => await import('@/components/Layout/WalletFastOrderLayout'),
  {
    ssr: false,
  },
);

const FastOrderSellPage = dynamic(
  async () => await import('@/components/Page/Panel/FastOrder/Sell'),
  { ssr: false },
);

const FastOrderSell: NextPageWithLayout<any> = () => {
  return <FastOrderSellPage />;
};

FastOrderSell.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletFastOrderLayout>{page}</WalletFastOrderLayout>
    </PanelLayout>
  );
};

export default FastOrderSell;
