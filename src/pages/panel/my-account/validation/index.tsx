import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const ValidationRootPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Validation/ValidationRoot'),
  { ssr: false },
);

const ValidationRoot: NextPageWithLayout<any> = () => {
  return <ValidationRootPage />;
};

ValidationRoot.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default ValidationRoot;
