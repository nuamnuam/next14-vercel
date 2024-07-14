import { AuthLayout } from '@/components/Layout';
import ResetPasswordPage from '@/components/Page/Auth/ResetPassword/ResetPassword';
import { type NextPageWithLayout } from '@/types/nextjs';

const ResetPassword: NextPageWithLayout<any> = () => {
  return <ResetPasswordPage />;
};

ResetPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
