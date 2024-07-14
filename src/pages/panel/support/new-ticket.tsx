import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';
const NewTicketPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/Support/Tickets/NewTicketPage'),
  { ssr: false },
);

const NewTicket: NextPageWithLayout<any> = () => {
  return <NewTicketPage />;
};

NewTicket.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default NewTicket;
