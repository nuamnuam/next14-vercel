import LandingLayout from '@/components/Layout/Landing';
import CommissionPage from '@/components/Page/Commission/CommissionPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const Commission: NextPageWithLayout<any> = () => {
  return <CommissionPage />;
};

Commission.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Commission;
