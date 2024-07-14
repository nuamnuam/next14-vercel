import React, { FC } from 'react';

import { Skeleton } from '@/components/Common';
import { useCurrencySingleStrapi } from '@/requests/single-coin/getStrapiSingleCoin';
import { useLang } from '@/hooks';

import { useSingleCurrency } from '@/requests/single-coin/getSingleCurrency';

import Coin from './Coin';

type Props = {
  coin: string;
};

const SimillarCoins: FC<Props> = ({ coin }) => {
  const [singleCoin] = useLang(['singleCoin']);

  const { data: singleCurrency, isLoading } = useSingleCurrency(coin);
  const { data: singleCurrencyStrapi } = useCurrencySingleStrapi();

  const related_currencies = singleCurrency?.result?.related_currencies || [];
  if (related_currencies.length < 1) return;

  if (!singleCurrency || isLoading || !singleCurrencyStrapi)
    return <SimillarCoinsSkeleton />;

  return (
    <section className="flex flex-col justify-between mt-5">
      <h2 className="pb-4 font-bold text-dark-700">
        {singleCoin.similarCoins}
      </h2>
      <div className="flex flex-col gap-4">
        {related_currencies.map((i) => (
          <Coin symbol={i.symbol} />
        ))}
      </div>
    </section>
  );
};

export default SimillarCoins;

const SimillarCoinsSkeleton = () => {
  return (
    <section className="flex flex-col justify-between mt-5">
      <h2 className="pb-4 font-bold text-dark-700">
        <Skeleton type="title" />
      </h2>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((i, idx) => (
          <div key={idx} className="flex gap-2 py-4 border-t border-t-dark-100">
            <div className="flex items-center justify-between">
              <Skeleton type="icon" />

              <Skeleton type="chip" />
            </div>
            <h3 className="mt-2 flex items-center justify-start gap-x-2 text-base font-medium text-dark-700">
              <Skeleton type="text" />

              <Skeleton type="text" />
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};
