import dynamic from 'next/dynamic';

import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';

const InstantMarketPage = dynamic(
  async () => await import('@/components/Page/Panel/Market'),
  { ssr: false },
);

const InstantMarket: NextPageWithLayout<any> = () => {
  return <InstantMarketPage />;
};

InstantMarket.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default InstantMarket;
