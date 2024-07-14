import { AuthLayout } from '@/components/Layout';
import PaymentResultPage from '@/components/Page/PaymentResult';
import { type NextPageWithLayout } from '@/types/nextjs';

const PaymentResult: NextPageWithLayout<any> = () => {
  return <PaymentResultPage />;
};

PaymentResult.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default PaymentResult;
