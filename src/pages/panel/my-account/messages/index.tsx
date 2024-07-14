import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const MessagesPage = dynamic(
  async () => await import('@/components/Page/Panel/MyAccount/Messages'),
  { ssr: false },
);

const Messages: NextPageWithLayout<any> = () => {
  return <MessagesPage />;
};

Messages.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Messages;
