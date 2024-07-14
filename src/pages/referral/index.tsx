import LandingLayout from '@/components/Layout/Landing';
import ReferralPage from '@/components/Page/Referral/ReferralPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const Referral: NextPageWithLayout<any> = () => {
  return <ReferralPage />;
};

Referral.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Referral;
