import { type NextPageWithLayout } from '@/types/nextjs';

import LandingLayout from '@/components/Layout/Landing';
import AnnouncementPage from '@/components/Page/Announcement/AnnouncementPage';
import ContentSectionPage from '@/components/Page/Announcement/ContentSection/ContentSectionPage';

const Announcement: NextPageWithLayout<any> = () => {
  return (
    <AnnouncementPage>
      <ContentSectionPage />
    </AnnouncementPage>
  );
};

Announcement.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Announcement;
