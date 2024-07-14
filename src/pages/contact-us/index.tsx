import LandingLayout from '@/components/Layout/Landing';
import ContactUsPage from '@/components/Page/ContactUs/ContactUsPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const ContactUs: NextPageWithLayout<any> = () => {
  return <ContactUsPage />;
};

ContactUs.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default ContactUs;
