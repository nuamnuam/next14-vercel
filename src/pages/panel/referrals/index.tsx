import dynamic from 'next/dynamic';

import { type NextPageWithLayout } from '@/types/nextjs';
import { PanelLayout } from '@/components/Layout';

const ReferralsPage = dynamic(
  async () => await import('@/components/Page/Panel/Referrals'),
  { ssr: false },
);

const referrals: NextPageWithLayout<any> = () => {
  return <ReferralsPage />;
};

referrals.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default referrals;
