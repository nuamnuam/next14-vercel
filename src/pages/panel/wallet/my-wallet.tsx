import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import dynamic from 'next/dynamic';
const MyWalletPage = dynamic(
  async () => await import('@/components/Page/Panel/Wallet/MyWallet'),
  { ssr: false },
);

const MyWallet: NextPageWithLayout<any> = () => {
  return <MyWalletPage />;
};

MyWallet.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default MyWallet;
