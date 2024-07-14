import { PanelLayout } from '@/components/Layout';
import {
  ResponsiveTableContent,
  TableContent,
} from '@/components/Page/Panel/MyAccount/Messages/components';
import { useBreakpoint } from '@/hooks';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const MessagesPage = dynamic(
  async () => await import('@/components/Page/Panel/MyAccount/Messages'),
  { ssr: false },
);

const Messages: NextPageWithLayout<any> = () => {
  const { isDesktop } = useBreakpoint();

  return (
    <MessagesPage>
      {isDesktop ? (
        <TableContent selectedTab={'notification'} />
      ) : (
        <ResponsiveTableContent selectedTab={'notification'} />
      )}
    </MessagesPage>
  );
};

Messages.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Messages;
