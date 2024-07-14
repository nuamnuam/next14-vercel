import dynamic from 'next/dynamic';

import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';

const AdvanceMarketPage = dynamic(
  async () => await import('@/components/Page/Panel/Market'),
  { ssr: false },
);

const AdvanceMarket: NextPageWithLayout<any> = () => {
  return <AdvanceMarketPage />;
};

AdvanceMarket.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default AdvanceMarket;
