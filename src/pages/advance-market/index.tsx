import LandingLayout from '@/components/Layout/Landing';
import MarketPage from '@/components/Page/Market/AdvanceMarketPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const Market: NextPageWithLayout<any> = () => {
  return <MarketPage />;
};

Market.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Market;
