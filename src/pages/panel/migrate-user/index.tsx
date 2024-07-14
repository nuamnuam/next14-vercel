import { PanelLayout } from '@/components/Layout';
import MigrateUserPage from '@/components/Page/Panel/MigrateUser';
import { type NextPageWithLayout } from '@/types/nextjs';

const MigrateUser: NextPageWithLayout<any> = () => {
  return <MigrateUserPage />;
};

MigrateUser.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default MigrateUser;
