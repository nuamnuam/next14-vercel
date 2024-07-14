import { type GetServerSideProps } from 'next';

import LandingLayout from '@/components/Layout/Landing';
import AnnouncementPage from '@/components/Page/Announcement/AnnouncementPage';
import { type NextPageWithLayout } from '@/types/nextjs';
import DepositDetail from '@/components/Page/Announcement/ContentSection/Transactions/TransactionDetail';
import ContentSectionPage from '@/components/Page/Announcement/ContentSection/ContentSectionPage';

interface Props {
  main: string;
  title: string;
  id: string;
}

const AnnouncementContent: NextPageWithLayout<Props> = (props) => {
  return <ContentSectionPage children={<DepositDetail />} />;
};

AnnouncementContent.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LandingLayout>
      <AnnouncementPage>{page}</AnnouncementPage>
    </LandingLayout>
  );
};

export default AnnouncementContent;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { main, title, id } = context.query;
  return {
    props: { main: main ?? '', title: title ?? '', id: id ?? '' },
  };
};
