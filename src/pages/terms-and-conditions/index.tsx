import { type NextPageWithLayout } from '@/types/nextjs';

import LandingLayout from '@/components/Layout/Landing';
import TermsAndConditionsPage from '@/components/Page/TermsAndConditions/TermsAndConditionsPage';

const TermsAndConditions: NextPageWithLayout<any> = () => {
  return <TermsAndConditionsPage />;
};

TermsAndConditions.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default TermsAndConditions;
