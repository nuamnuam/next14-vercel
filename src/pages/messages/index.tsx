import LandingLayout from '@/components/Layout/Landing';
import MessagesPage from '@/components/Page/Panel/MyAccount/Messages';
import { type NextPageWithLayout } from '@/types/nextjs';

const Messages: NextPageWithLayout<any> = () => {
  return <MessagesPage />;
};

Messages.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Messages;
