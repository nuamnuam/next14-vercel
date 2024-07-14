import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const SecurityPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Security/SecurityPage'),
  { ssr: false },
);

const Security: NextPageWithLayout<any> = () => {
  return <SecurityPage />;
};

Security.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Security;
