import { FC, useMemo } from 'react';
import Link from 'next/link';

import { useLang } from '@/hooks';
import { getPrecisionCount, toPersianDigits, toPrice } from '@/utils';
import { Button } from '@/components/Common';
import { authStore } from '@/store';
import type { ISingleCoin } from '@/requests/single-coin';
import { IPairResult } from '@/hooks/useMarketData';

import { renderChip } from '../../Market/CoinsTable/Market';

type Props = {
  currency: ISingleCoin;
  name: string;
  update?: IPairResult[];
};

const PriceSection: FC<Props> = ({ currency, name, update }) => {
  const [singleCoin] = useLang(['singleCoin']);

  const { token } = authStore();
  const isLogin = !!token;

  const {
    last_usd_price,
    last_irt_price,
    marketcap,
    p2p_tradeable,
    otc_tradeable,
    key,
    p2p_tradingview_pair,
  } = currency;

  const updatedCoin = useMemo(() => {
    const result = update?.find((item) => item.key === `${key}IRT`);
    if (result) return result;
  }, [update]);

  if (!currency || !name) {
    return <></>;
  }

  return (
    <div className="mt-8 w-full md:w-auto border-t-2 border-t-dark-100 px-4 pt-8 md:mt-0 md:border-none md:px-0 md:pt-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-dark-500 whitespace-nowrap">
          {singleCoin.price} {name} {singleCoin.today}:
        </p>
        <div className="text-xl font-medium text-dark-700 flex flex-col-reverse md:flex-row">
          <span className="md:px-2 text-base text-dark-700 flex md:flex-col justify-end">
            ({toPrice(updatedCoin?.o.au || last_usd_price)}
            {singleCoin.dollar})
          </span>{' '}
          <span className="font-bold text-xl flex md:flex-col">
            {toPersianDigits(toPrice(updatedCoin?.o.a || last_irt_price))}{' '}
            {singleCoin.toman}
          </span>
        </div>
      </div>
      <div className="my-6 flex items-center justify-between">
        <p className="text-base font-medium text-dark-500">
          {singleCoin.last24hChanges + ' ' + name + ':'}
        </p>
        {renderChip(
          marketcap?.percent_change_24h || 0,
          false,
          undefined,
          getPrecisionCount(2),
        )}
      </div>
      <div className="flex items-center justify-between gap-x-4">
        {otc_tradeable ? (
          <Button size="md" variant="primary" className="w-full">
            <Link href={`/panel/instant-trade/buy?asset=${key}`}>
              {singleCoin.annieDeal}
            </Link>
          </Button>
        ) : null}

        {p2p_tradeable && p2p_tradingview_pair ? (
          <Button size="md" variant="dark" className="w-full">
            <Link
              href={
                isLogin
                  ? `/panel/advance-trade/${p2p_tradingview_pair}`
                  : `/advance-trade/${p2p_tradingview_pair}`
              }
            >
              {singleCoin.advancedDeal}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default PriceSection;
