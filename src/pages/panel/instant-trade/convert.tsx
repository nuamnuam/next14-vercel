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

const FastOrderConvertPage = dynamic(
  async () => await import('@/components/Page/Panel/FastOrder/Convert'),
  { ssr: false },
);

const FastOrderConvert: NextPageWithLayout<any> = () => {
  return <FastOrderConvertPage />;
};

FastOrderConvert.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletFastOrderLayout>{page}</WalletFastOrderLayout>
    </PanelLayout>
  );
};

export default FastOrderConvert;
