import React, { FC, useMemo } from 'react';

import { SuccessSingleCoinResponse } from '@/requests/single-coin';
import { SuccessCurrencySingleResponse } from '@/requests/single-coin/getStrapiSingleCoin';
import { useBreakpoint, useLang } from '@/hooks';
import type { IPairResult } from '@/hooks/useMarketData';

import parseData from './parseData';
import SimillarCoins from './SimillarCoins';
import TableOfContent from './TableOfContent';
import CoinDescriptionSkeleton from './CoinDescriptionSkeleton';
import Info from './Info';

type Props = {
  singleCurrency?: SuccessSingleCoinResponse;
  singleCurrencyStrapi?: SuccessCurrencySingleResponse;
  isLoading: boolean;
  update?: IPairResult[];
};

const CoinDescription: FC<Props> = ({
  singleCurrency,
  singleCurrencyStrapi,
  isLoading,
  update,
}) => {
  const [singleCoin] = useLang(['singleCoin']);

  const { isDesktop } = useBreakpoint();

  const DATA: any = useMemo(
    () => (singleCurrencyStrapi ? parseData(singleCurrencyStrapi) : {}),
    [singleCurrencyStrapi],
  );

  if (!singleCurrency || !DATA || isLoading) return <CoinDescriptionSkeleton />;

  return (
    <div className="flex flex-col-reverse gap-y-6 gap-x-4 md:flex-row">
      <main className="w-full md:w-[880px]">
        <h2 className="border-b border-b-dark-100 pb-3 mb-6 text-l font-bold text-dark-700">
          {singleCoin.aboutCrypto} {DATA.name}
        </h2>
        <TableOfContent items={DATA.headings} />

        <article
          className="text-sm font-medium leading-7 text-dark-500"
          dangerouslySetInnerHTML={{
            __html: DATA.html,
          }}
        />
        {!isDesktop && <SimillarCoins coin={singleCurrency.result.key} />}
      </main>
      <aside className="lg:sticky top-2 w-full h-max md:mt-0 md:w-[420px]">
        <h2 className="border-b border-b-dark-100 pb-3 text-l font-bold text-dark-700">
          {singleCoin.status} {DATA.name}
        </h2>
        <Info currency={singleCurrency.result} DATA={DATA} update={update} />
        {isDesktop && <SimillarCoins coin={singleCurrency.result.key} />}
      </aside>
    </div>
  );
};

export default CoinDescription;
