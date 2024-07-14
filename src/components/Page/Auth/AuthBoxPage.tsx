import styles from './styles.module.scss';
import { useBreakpoint } from '@/hooks';
import Header from '@/components/Layout/Auth/Header';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Logo } from '@/components/Common';

interface Props {
  children: React.ReactNode;
  header: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
}

const AuthBoxPage: React.FC<Props> = ({ children, header, icon, extra }) => {
  const { isMobile } = useBreakpoint();
  return (
    <div
      className={`mx-auto h-full bg-white md:mt-[72px] md:bg-transparent ${styles.authBox}`}
    >
      {!isMobile ? (
        <Logo type="full" size="md" classNames="px-4 md:px-0" />
      ) : (
        <Header />
      )}
      <div
        className={`mt-4 bg-white px-4 pb-6 pt-0 md:rounded-lg md:p-10 md:shadow-card lg:rounded-lg`}
      >
        <div className="mt-6 flex h-full w-full flex-col justify-between text-right md:mt-0 ">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-primary-50">
              {icon}
            </div>
            <h1 className="mr-2 text-lg font-bold text-dark-600">{header}</h1>
            {extra ? <div className="mr-auto">{extra}</div> : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const AuthBoxWrapper = <T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const Wrapper: React.FC<T> = (props) => {
    const router = useRouter();

    useEffect(() => {
      if (
        router.pathname.startsWith('/auth/reset-password') &&
        !sessionStorage.getItem('temp-token')
      ) {
        router.replace('/auth/login');
      }
    }, []);

    useEffect(() => {
      const userIsLogin = !!Cookies.get('token');
      if (userIsLogin) router.push('/panel/dashboard');
    }, []);
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default AuthBoxWrapper(AuthBoxPage);
