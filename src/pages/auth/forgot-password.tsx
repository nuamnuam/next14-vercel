import { AuthLayout } from '@/components/Layout';
import ForgotPasswordPage from '@/components/Page/Auth/ForgotPassword/ForgotPassword';
import { type NextPageWithLayout } from '@/types/nextjs';

const ForgotPassword: NextPageWithLayout<any> = () => {
  return <ForgotPasswordPage />;
};

ForgotPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ForgotPassword;
