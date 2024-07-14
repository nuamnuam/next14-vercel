import { PanelLayout, WalletDepositLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import CryptoDepositPage from '@/components/Page/Panel/Wallet/CryptoDeposit';

const CryptoDeposit: NextPageWithLayout<any> = () => {
  return <CryptoDepositPage />;
};

CryptoDeposit.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletDepositLayout>{page}</WalletDepositLayout>
    </PanelLayout>
  );
};

export default CryptoDeposit;
