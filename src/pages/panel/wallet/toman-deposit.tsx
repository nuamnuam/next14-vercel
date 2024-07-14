import { PanelLayout, WalletDepositLayout } from '@/components/Layout';
import TomanDepositPage from '@/components/Page/Panel/Wallet/TomanDeposit';
import { type NextPageWithLayout } from '@/types/nextjs';

const TomanDeposit: NextPageWithLayout<any> = () => {
  return <TomanDepositPage />;
};

TomanDeposit.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletDepositLayout>{page}</WalletDepositLayout>
    </PanelLayout>
  );
};

export default TomanDeposit;
