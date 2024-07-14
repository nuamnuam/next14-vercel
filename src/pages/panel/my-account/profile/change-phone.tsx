import dynamic from 'next/dynamic';

const ChangePhonePage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Profile/ChangePhonePage'),
  { ssr: false },
);

const ChangePhone = () => {
  return <ChangePhonePage />;
};

export default ChangePhone;
