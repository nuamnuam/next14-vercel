import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import CryptoWithdrawPage from '@/components/Page/Panel/Wallet/CryptoWithdraw';
import WalletWithdrawLayout from '@/components/Layout/WalletWithdrawLayout';

const CryptoWithdraw: NextPageWithLayout<any> = () => {
  return <CryptoWithdrawPage />;
};

CryptoWithdraw.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletWithdrawLayout>{page}</WalletWithdrawLayout>
    </PanelLayout>
  );
};

export default CryptoWithdraw;
