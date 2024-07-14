import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import CommissionPage from '@/components/Page/Panel/MyAccount/Commission';

const Commission: NextPageWithLayout<any> = () => {
  return <CommissionPage />;
};

Commission.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Commission;
