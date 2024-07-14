import React from 'react';
import Link from 'next/link';

import { Card, Button } from '@/components';
import MarketTable from '@/components/Page/Market/CoinsTable/Market';
import { useLang } from '@/hooks';

const AdvancedMarketTable: React.FC = () => {
  const [panelDashboard] = useLang(['panelDashboard']);

  return (
    <>
      <Card>
        <div className="flex w-full items-center justify-between px-4 py-6 md:px-6  md:flex-row lg:p-0">
          <p className="w-max text-dark-700 md:pr-6">
            {panelDashboard.advancedTradingMarkets}
          </p>
          <div className="flex w-max items-center justify-end gap-x-5 md:w-[446px] md:px-9 md:py-5">
            <Button variant="text" className="!px-0">
              <Link href={'/panel/advance-market'}>
                {panelDashboard.allBitCoins}
              </Link>
            </Button>
          </div>
        </div>
        <MarketTable showChartBoxes={false} />
      </Card>
    </>
  );
};

export default AdvancedMarketTable;
