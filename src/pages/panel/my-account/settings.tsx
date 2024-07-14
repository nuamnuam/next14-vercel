import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';

const SettingsPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Settings/SettingsPage'),
  { ssr: false },
);

const Settings: NextPageWithLayout<any> = () => {
  return <SettingsPage />;
};

Settings.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default Settings;
