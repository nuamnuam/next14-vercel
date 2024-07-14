import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import TomanWithdrawPage from '@/components/Page/Panel/Wallet/TomanWithdraw';
import WalletWithdrawLayout from '@/components/Layout/WalletWithdrawLayout';

const TomanWithdraw: NextPageWithLayout<any> = () => {
  return <TomanWithdrawPage />;
};

TomanWithdraw.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletWithdrawLayout>{page}</WalletWithdrawLayout>
    </PanelLayout>
  );
};

export default TomanWithdraw;
