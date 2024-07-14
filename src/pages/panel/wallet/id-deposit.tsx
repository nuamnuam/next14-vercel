import { type NextPageWithLayout } from '@/types/nextjs';
import { PanelLayout, WalletDepositLayout } from '@/components/Layout';
import IdDepositPage from '@/components/Page/Panel/Wallet/IdDeposit';

const IdDeposit: NextPageWithLayout<any> = () => {
  return <IdDepositPage />;
};

IdDeposit.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PanelLayout>
      <WalletDepositLayout>{page}</WalletDepositLayout>
    </PanelLayout>
  );
};

export default IdDeposit;
