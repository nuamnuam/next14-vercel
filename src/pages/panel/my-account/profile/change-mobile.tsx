import dynamic from 'next/dynamic';

const ChangeMobilePage = dynamic(
  async () =>
    await import('@/components/Page/Panel/MyAccount/Profile/ChangeMobilePage'),
  { ssr: false },
);

const ChangeMobile = () => {
  return <ChangeMobilePage />;
};

export default ChangeMobile;
