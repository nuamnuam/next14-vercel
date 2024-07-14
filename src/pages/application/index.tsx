import LandingLayout from '@/components/Layout/Landing';
import ApplicationPage from '@/components/Page/Application/ApplicationPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const Application: NextPageWithLayout<any> = () => {
  return <ApplicationPage />;
};

Application.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Application;
