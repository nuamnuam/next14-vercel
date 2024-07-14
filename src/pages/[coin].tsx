import LandingLayout from '@/components/Layout/Landing';
import SingleCoinPage from '@/components/Page/SingleCoin/SingleCoinPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const SingleCoin: NextPageWithLayout<any> = () => {
  return <SingleCoinPage />;
};

SingleCoin.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default SingleCoin;
