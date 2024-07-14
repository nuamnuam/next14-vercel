import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';
const DashboardPage = dynamic(
  async () => await import('@/components/Page/Panel/Dashboard/Dashboard'),
  { ssr: false },
);

const FastOrder: NextPageWithLayout<any> = () => {
  return <DashboardPage />;
};

FastOrder.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default FastOrder;
