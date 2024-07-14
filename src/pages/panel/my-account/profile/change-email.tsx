import dynamic from 'next/dynamic';

const ChangeEmailPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Profile/ChangeEmailPage'),
  { ssr: false },
);

const ChangeEmail = () => {
  return <ChangeEmailPage />;
};

export default ChangeEmail;
