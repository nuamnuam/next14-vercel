import dynamic from 'next/dynamic';
import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';

const MyAccountPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Profile/MyAccountPage'),
  { ssr: false },
);

const MyAccount: NextPageWithLayout<any> = () => {
  return <MyAccountPage />;
};

MyAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default MyAccount;
