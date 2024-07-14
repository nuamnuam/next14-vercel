import dynamic from 'next/dynamic';
import { type NextPageWithLayout } from '@/types/nextjs';

import { PanelLayout } from '@/components/Layout';

const TicketDetailsPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/Support/Tickets/TicketDetailsPage'),
  { ssr: false },
);

const TicketDetail: NextPageWithLayout<any> = () => {
  return <TicketDetailsPage />;
};

TicketDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default TicketDetail;
