import { type GetServerSideProps } from 'next';

import { HelpLayout } from '@/components/Layout';
import LandingLayout from '@/components/Layout/Landing';
import HelpPage from '@/components/Page/Help/HelpPage';
import { type NextPageWithLayout } from '@/types/nextjs';

interface Props {
  main: string;
}

const Help: NextPageWithLayout<Props> = ({ main }) => {
  return <HelpPage main={main} />;
};

Help.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LandingLayout>
      <HelpLayout>{page}</HelpLayout>
    </LandingLayout>
  );
};

export default Help;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { main } = context.query;
  return {
    props: { main: main ?? '' },
  };
};
