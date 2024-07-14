import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const ProfilePage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Profile/ProfilePage'),
  { ssr: false },
);

const Profile: NextPageWithLayout<any> = () => {
  return <ProfilePage />;
};

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Profile;
