import { PanelLayout } from '@/components/Layout';
import dynamic from 'next/dynamic';

import { type NextPageWithLayout } from '@/types/nextjs';

const OpenOrdersPage = dynamic(
  async () => await import('@/components/Page/Panel/Wallet/OpenOrders'),
  {
    ssr: false,
  },
);

const OpenOrders: NextPageWithLayout<any> = () => {
  return <OpenOrdersPage />;
};

OpenOrders.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default OpenOrders;
