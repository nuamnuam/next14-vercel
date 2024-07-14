import dynamic from 'next/dynamic';
import { type NextPageWithLayout } from '@/types/nextjs';

import { AuthLayout } from '@/components/Layout';

const LoginPage = dynamic(
  async () => await import('@/components/Page/Auth/Login/LoginPage'),
  {
    ssr: false,
  },
);
const Login: NextPageWithLayout<any> = () => {
  return <LoginPage />;
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
