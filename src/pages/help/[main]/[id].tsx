import { HelpLayout } from '@/components/Layout';
import LandingLayout from '@/components/Layout/Landing';
import HelpContentPage from '@/components/Page/Help/HelpContentPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const HelpContent: NextPageWithLayout = () => {
  return <HelpContentPage />;
};

HelpContent.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LandingLayout>
      <HelpLayout>{page}</HelpLayout>
    </LandingLayout>
  );
};

export default HelpContent;
