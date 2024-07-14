import React, { FC } from 'react';
import Link from 'next/link';

import { Card, Skeleton } from '@/components';
import { useBreakpoint, useLang } from '@/hooks';
import { type SuccessCurrencySingleResponse } from '@/requests/single-coin/getStrapiSingleCoin';
import ResponsiveTableContent from '@/components/Page/Market/CoinsTable/Market/ResponiveTableContent';

import TableContent from '../../Market/CoinsTable/Market/TableContent';

type Props = {
  singleCurrencyStrapi: SuccessCurrencySingleResponse;
  isLoading: boolean;
};

const PairsCoinTable: FC<Props> = ({ singleCurrencyStrapi, isLoading }) => {
  const [singleCoin] = useLang(['singleCoin']);

  const { isDesktop } = useBreakpoint();

  if (isLoading || !singleCurrencyStrapi) return <PairsCoinTableSkeleton />;

  const attr = singleCurrencyStrapi?.data?.[0]?.attributes;

  return (
    <section className="px-4 md:px-0 my-8 md:my-12">
      <Card classNames="shadow-box">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-base font-bold text-dark-600">
            {singleCoin.tradeMarkets} {attr?.name}
          </h2>
          <Link
            href="/instant-market"
            className="text-sm font-medium leading-6 text-dark-700"
          >
            {singleCoin.allmarkets}
          </Link>
        </div>

        {isDesktop ? (
          <TableContent pairsCoin={attr.symbol} />
        ) : (
          <ResponsiveTableContent pairsCoin={attr.symbol} />
        )}
      </Card>
    </section>
  );
};

export default PairsCoinTable;

const PairsCoinTableSkeleton = () => {
  return (
    <section className="px-4 md:px-0">
      <Card classNames=" my-8 md:my-12 shadow-box">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-base font-bold text-dark-600">
            <Skeleton type="title" />
          </h2>
          <Skeleton type="text" />
        </div>
      </Card>
    </section>
  );
};
