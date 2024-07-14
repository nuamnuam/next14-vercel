import React from 'react';
import { useRouter } from 'next/router';

import {
  AdvanceMarketContent,
  InstantMarketContent,
} from './components/MarketContent';

const MarketPage: React.FC = () => {
  const router = useRouter();
  const isInAdvanceMarketPage = router.pathname.includes('advance');

  if (isInAdvanceMarketPage) return <AdvanceMarketContent />;
  return <InstantMarketContent />;
};

export default MarketPage;
