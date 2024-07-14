import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'classnames';

import Footer from '@/components/Footer';
import { useProfileMutation } from '@/requests/profileMutation';
import { GuideModal } from '@/components/Page/PWA/components';

export type FooterProps = {
  footer_data?: any;
  contact_us?: any;
  isLoading?: boolean;
};

type Props = {
  children: React.ReactNode;
  classname?: string;
} & FooterProps;

const Header = dynamic(async () => await import('./Header'), { ssr: false });

const LandingLayout: React.FC<Props> = ({
  children,
  classname,
  footer_data,
  contact_us,
  isLoading,
}) => {
  const { mutateAsync: profileMutateAsync } = useProfileMutation();

  useEffect(() => {
    if (sessionStorage.getItem('temp-token')) {
      profileMutateAsync();
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className={clsx('flex-1', classname || '')}>{children}</div>
      <Footer
        footer_data={footer_data}
        contact_us={contact_us}
        isLoading={isLoading}
      />
      <GuideModal />
    </main>
  );
};

export default LandingLayout;
