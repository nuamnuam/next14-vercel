import { AuthLayout } from '@/components/Layout';
import SignupPage from '@/components/Page/Auth/SignUp/SignupPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const Signup: NextPageWithLayout<any> = () => {
  return <SignupPage />;
};

Signup.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Signup;
