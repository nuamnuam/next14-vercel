import { FC, useMemo } from 'react';
import classNames from 'classnames';

import { useLang } from '@/hooks';
import { toPersianDigits, toPrice } from '@/utils';
import type { ISingleCoin } from '@/requests/single-coin';
import type { SuccessCurrencySingleResponse } from '@/requests/single-coin/getStrapiSingleCoin';
import type { IPairResult } from '@/hooks/useMarketData';

type Props = {
  currency: ISingleCoin;
  strapiData: SuccessCurrencySingleResponse;
  update?: IPairResult[];
};

const Stat: FC<Props> = ({ currency, strapiData, update }) => {
  const [singleCoin] = useLang(['singleCoin']);

  const { last_irt_price, marketcap, key } = currency;

  const updatedCoin = useMemo(() => {
    const result = update?.find((item) => item.key === `${key}IRT`);
    if (result) return result;
  }, [update]);

  const currencyStatistics = useMemo(() => {
    return [
      {
        title: `${singleCoin.aniiPrice} ${strapiData?.data[0]?.attributes?.name}`,
        price: `${updatedCoin?.o.a || last_irt_price || ''} ${
          singleCoin.toman
        }`,
      },
      {
        title:
          singleCoin['24hTrades'] + ' ' + strapiData.data[0].attributes.symbol,
        price: `${marketcap['24h_volume_usd']}`,
        symbol: 'USD',
      },
      {
        title: singleCoin.marketSize,
        price: marketcap.market_cap_usd,
        symbol: 'USD',
      },
      { title: singleCoin.availableStock, price: marketcap?.max_supply },
      {
        title: singleCoin.coinCirculation,
        price: marketcap.circulating_supply,
      },
    ];
  }, [updatedCoin]);

  return (
    <div className="grid mb-12 items-center justify-between overflow-auto lg:border-t border-dark-100 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      {currencyStatistics.map(({ title, price, symbol }, index) => (
        <div
          className={classNames(
            'flex min-w-[137px] gap-y-1 flex-col justify-center max-[740]:col-span-2 col-span-1 border-l border-dark-50 px-6 py-4 md:min-w-0 border-b',
          )}
        >
          <h3 className="text-xs font-medium leading-6 text-dark-300 md:text-sm">
            {title}
          </h3>
          <p
            className={classNames(
              'text-xs font-bold leading-6 text-dark-700 md:text-sm',
              index === 0 && 'text-primary-600',
            )}
          >
            {symbol ? (
              <span className="text-dark-500 font-normal text-[10px] px-2">
                {symbol}
              </span>
            ) : (
              <></>
            )}
            {toPersianDigits(toPrice(price))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stat;
