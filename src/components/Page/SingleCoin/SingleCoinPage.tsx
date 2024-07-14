import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { useFavoriteCoin } from '@/requests/single-coin/favoriteCoin';
import { useCurrencySingleStrapi } from '@/requests/single-coin/getStrapiSingleCoin';
import { Card, Icon } from '@/components/Common';
import { useBreakpoint, useCoinIcon, useLang, useMarketData } from '@/hooks';
import useAuthStore from '@/store/authStore';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { queryClient } from '@/requests';
import CustomTooltip from '@/components/Common/Tooltip';
import AuthBgOriented from '@/assets/images/OrientedAuthBackground.svg';
import AuthBg from '@/assets/images/AuthBackground.svg';
import { useSingleCurrencyWithSlug } from '@/requests/single-coin/getCoinWithSlug';
import { useSingleCurrency } from '@/requests/single-coin/getSingleCurrency';

import {
  Chart,
  News,
  QuestionsMenu,
  PairsCoinTable,
  CoinDescription,
  PriceSection,
  Skeleton,
} from './components';

const SingleCoinPage = () => {
  const [singleCoin] = useLang(['singleCoin']);

  const [pairs, setPairs] = useState<string[]>([]);

  const { isDesktop, isTablet } = useBreakpoint();

  const router = useRouter();
  const { coin } = router.query;

  const { data } = useSingleCurrencyWithSlug(coin as string);

  const { data: singleCurrency, isLoading } = useSingleCurrency(
    data?.result?.[0]?.symbol,
  );

  const { data: singleCurrencyStrapi } = useCurrencySingleStrapi(
    singleCurrency?.result.key,
  );
  const { mutate: favoriteCoin } = useFavoriteCoin();

  const isUserLoggedIn = useAuthStore((state) => !!state.token);

  const coinIcon = useCoinIcon();

  const breadCrumbs = useMemo(() => {
    const items = [
      { label: singleCoin.startPage, href: '/' },
      { label: singleCoin.markets, href: '/instant-market' },
    ];

    if (singleCurrencyStrapi?.data) {
      items.push({
        label:
          singleCoin.crypto +
          ' ' +
          singleCurrencyStrapi?.data[0]?.attributes?.name,
        href: `/${singleCurrencyStrapi?.data[0]?.attributes?.symbol}`,
      });
    }

    return items;
  }, [singleCurrencyStrapi]);

  const { update } = useMarketData(
    pairs.length ? pairs : [`${singleCurrency?.result?.key}IRT`],
  );

  const updatePairs = (input: string[]) => {
    if (input.length) {
      const result: string[] = [];
      input.forEach((item) => {
        if (!pairs.find((pair) => pair === item)) {
          result.push(item);
        }
      });
      setPairs([...pairs, ...result]);
    }
  };

  if (!singleCurrency || isLoading || !singleCurrencyStrapi)
    return <Skeleton />;

  const { name_en, symbol, name, faqs } =
    singleCurrencyStrapi.data[0].attributes;

  const { marketcap, p2p_tradeable, favorite, key } = singleCurrency.result;

  const toggleFavoriteCoin = () => {
    favoriteCoin(
      { symbol },
      {
        onSuccess() {
          queryClient.refetchQueries({
            queryKey: ['get-currency-single', coin],
          });
        },
      },
    );
  };

  return (
    <section
      className="bg-no-repeat bg-[100%_-108px] bg-[length:100%]"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="container pt-8 px-0 md:px-4">
        <div className="px-2">
          <BreadCrumb items={breadCrumbs} />
        </div>

        <header className="flex flex-col pt-7 items-start justify-between md:flex-row">
          <div className=" flex w-full gap-x-4 px-4 md:w-auto md:gap-x-8 md:px-0">
            {isDesktop ? (
              <Image
                src={coinIcon(key.toUpperCase())}
                width={198}
                height={148}
                alt={'coin'}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            ) : (
              <Image
                src={coinIcon(key.toUpperCase())}
                width={isTablet ? 64 : 32}
                height={isTablet ? 64 : 32}
                alt={'coin'}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            )}

            <div className="flex w-full justify-between md:flex-col">
              <div>
                <h2 className="text-xl  mb-2 md:text-[28px] font-bold text-dark-700">
                  {name}
                </h2>
                <h3 className="text-base font-medium text-dark-500">
                  {name_en} ({symbol})
                </h3>
              </div>
              <div className="flex:1 flex items-center justify-end gap-x-4 md:mt-6 md:flex-auto md:justify-start">
                {isUserLoggedIn ? (
                  favorite ? (
                    <button onClick={toggleFavoriteCoin}>
                      <Icon
                        icon="Star-Filled"
                        size={40}
                        className="shrink-0 rounded-lg border-2 bg-white border-primary-600 py-2 text-primary-600 shadow-button"
                      />
                    </button>
                  ) : (
                    <button onClick={toggleFavoriteCoin}>
                      <Icon
                        icon="Star-OutLined"
                        size={40}
                        className="shrink-0 rounded-lg border-2 bg-white border-dark-200 py-2 text-dark-500 shadow-button"
                      />
                    </button>
                  )
                ) : null}

                {marketcap?.website ? (
                  <Link
                    href={marketcap.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon
                      icon="Web-OutLined"
                      size={40}
                      className="shrink-0 rounded-lg border-2 bg-white border-dark-200 py-2 text-dark-500 shadow-button"
                    />
                  </Link>
                ) : null}

                <CustomTooltip
                  title={`${singleCoin?.rank} ${marketcap?.rank}`}
                  anchor={
                    <Icon
                      icon="Sort-OutLined"
                      size={40}
                      className="shrink-0 rounded-lg border-2 bg-white border-dark-200 py-2 text-dark-500 shadow-button"
                    />
                  }
                />
              </div>
            </div>
          </div>
          <PriceSection
            name={name}
            currency={singleCurrency.result}
            update={update}
          />
        </header>

        <Chart
          pair={singleCurrency.result.tradingview_pair}
          p2pPair={singleCurrency.result.p2p_tradingview_pair}
          singleCurrency={singleCurrency}
          singleCurrencyStrapi={singleCurrencyStrapi}
          isLoading={isLoading}
          update={update}
          updatePairs={updatePairs}
        />
        {p2p_tradeable ? (
          <PairsCoinTable
            singleCurrencyStrapi={singleCurrencyStrapi}
            isLoading={isLoading}
          />
        ) : (
          <></>
        )}
        <Card as="section" classNames="mx-4 md:mx-0 p-4">
          <CoinDescription
            singleCurrency={singleCurrency}
            singleCurrencyStrapi={singleCurrencyStrapi}
            isLoading={isLoading}
            update={update}
          />
        </Card>
        {faqs.data.length > 0 ? (
          <QuestionsMenu
            singleCurrency={singleCurrency}
            singleCurrencyStrapi={singleCurrencyStrapi}
            isLoading={isLoading}
          />
        ) : null}
      </div>

      <div
        className="bg-no-repeat py-10 bg-[length:100%] bg-[1px_-155px]"
        style={{
          backgroundImage: isDesktop ? `url('${AuthBgOriented.src}')` : '',
        }}
      >
        <div className="container px-0 md:px-4">
          <News coin={coin as string} />
        </div>
      </div>
    </section>
  );
};

export default SingleCoinPage;
