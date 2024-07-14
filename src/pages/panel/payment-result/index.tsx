import { PanelLayout } from '@/components/Layout';
import PaymentResultPage from '@/components/Page/PaymentResult/PaymentResultPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const PaymentResult: NextPageWithLayout<any> = () => {
  return <PaymentResultPage />;
};

PaymentResult.getLayout = function getLayout(page: React.ReactElement) {
  return <PanelLayout>{page}</PanelLayout>;
};

export default PaymentResult;
