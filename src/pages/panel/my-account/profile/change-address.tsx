import dynamic from 'next/dynamic';

const ChangeAddressPage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Profile/ChangeAddressPage'),
  { ssr: false },
);

const ChangeAddress = () => {
  return <ChangeAddressPage />;
};

export default ChangeAddress;
