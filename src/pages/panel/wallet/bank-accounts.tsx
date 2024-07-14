import { PanelLayout, WalletDepositLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import BankAccountsPage from '@/components/Page/Panel/Wallet/BankAccounts';

const BankAccounts: NextPageWithLayout<any> = () => {
  return <BankAccountsPage />;
};

BankAccounts.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default BankAccounts;
