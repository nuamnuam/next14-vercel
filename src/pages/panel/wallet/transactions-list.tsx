import { PanelLayout } from '@/components/Layout';
import { type NextPageWithLayout } from '@/types/nextjs';
import TransactionsPage from '@/components/Page/Panel/Wallet/Transactions';

const TransactionsList: NextPageWithLayout<any> = () => {
  return <TransactionsPage />;
};

TransactionsList.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default TransactionsList;
