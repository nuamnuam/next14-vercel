import { GetServerSideProps } from 'next';

import LandingLayout from '@/components/Layout/Landing';
import FaqsPage from '@/components/Page/Announcement copy/FaqsPage';
import { type NextPageWithLayout } from '@/types/nextjs';

interface Props {
  main: string;
}

const FAQs: NextPageWithLayout<Props> = ({ main }) => {
  return <FaqsPage main={main} />;
};

FAQs.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default FAQs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { main } = context.query;
  return {
    props: { main: main ?? '' },
  };
};
