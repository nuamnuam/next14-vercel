import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';
const TicketsPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/Support/Tickets/TicketsPage'),
  { ssr: false },
);

const Tickets: NextPageWithLayout<any> = () => {
  return <TicketsPage />;
};

Tickets.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Tickets;
