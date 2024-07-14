import dynamic from 'next/dynamic';
import { type NextPageWithLayout } from '@/types/nextjs';

import LandingLayout from '@/components/Layout/Landing';

const AdvancedTradePage = dynamic(
  async () => await import('@/components/Page/Panel/AdvanceTrade'),
  { ssr: false },
);

const AdvancedTrade: NextPageWithLayout<any> = () => {
  return <AdvancedTradePage />;
};

AdvancedTrade.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout classname="md:!py-8 md:!px-16">{page}</LandingLayout>;
};

export default AdvancedTrade;
