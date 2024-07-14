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

const FastOrderBuyPage = dynamic(
  async () => await import('@/components/Page/Panel/FastOrder/Buy'),
  { ssr: false },
);

const FastOrderBuy: NextPageWithLayout<any> = () => {
  return <FastOrderBuyPage />;
};

FastOrderBuy.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletFastOrderLayout>{page}</WalletFastOrderLayout>
    </PanelLayout>
  );
};

export default FastOrderBuy;
