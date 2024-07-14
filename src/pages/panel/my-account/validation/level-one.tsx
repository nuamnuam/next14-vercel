import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const ValidationLevelOnePage = dynamic(
  async () =>
    await import(
      '@/components/Page/Panel/MyAccount/Validation/ValidationLevelOne'
    ),
  { ssr: false },
);

const ValidationLevelOne: NextPageWithLayout<any> = () => {
  return <ValidationLevelOnePage />;
};

ValidationLevelOne.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default ValidationLevelOne;
