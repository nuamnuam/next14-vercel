import LandingLayout from '@/components/Layout/Landing';
import AboutUsPage from '@/components/Page/AboutUs/AboutUsPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const AboutUs: NextPageWithLayout<any> = () => {
  return <AboutUsPage />;
};

AboutUs.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default AboutUs;
