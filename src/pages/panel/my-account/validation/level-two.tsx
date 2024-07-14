import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const ValidationLevelTwoPage = dynamic(
  async () =>
    await import(
      '@/components/Page/Panel/MyAccount/Validation/ValidationLevelTwo'
    ),
  { ssr: false },
);

const ValidationLevelTwo: NextPageWithLayout<any> = () => {
  return <ValidationLevelTwoPage />;
};

ValidationLevelTwo.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default ValidationLevelTwo;
