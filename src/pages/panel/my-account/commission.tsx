import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const CommissionPage = dynamic(
  async () => await import('@/components/Page/Panel/MyAccount/Commission'),
  { ssr: false },
);

const Commission: NextPageWithLayout<any> = () => {
  return <CommissionPage />;
};

Commission.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Commission;
