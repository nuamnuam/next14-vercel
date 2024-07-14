import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';
const AdvancedTradePage = dynamic(
  async () => await import('@/components/Page/Panel/AdvanceTrade'),
  { ssr: false },
);

const AdvancedTrade: NextPageWithLayout<any> = () => {
  return <AdvancedTradePage />;
};

AdvancedTrade.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default AdvancedTrade;
