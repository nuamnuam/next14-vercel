import React, { FC, useEffect, useState } from 'react';
import Script from 'next/script';

import Calculator from '@/components/Calculator/Calculator';
import {
  ArzinjaChart,
  Card,
  Spinner,
  TradingViewChart,
} from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import RadioGroup from '@/components/RadioGroup';
import type { SuccessCurrencySingleResponse } from '@/requests/single-coin/getStrapiSingleCoin';
import type { SuccessSingleCoinResponse } from '@/requests/single-coin';

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from '../../../../../public/static/charting_library/charting_library';
import Stat from './Stat';
import { IPairResult } from '@/hooks/useMarketData';

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  interval: '5' as ResolutionString,
  library_path: '/static/charting_library/',
  locale: 'en',
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
};

type Props = {
  pair: string;
  p2pPair?: string;
  singleCurrency?: SuccessSingleCoinResponse;
  singleCurrencyStrapi?: SuccessCurrencySingleResponse;
  isLoading: boolean;
  update?: IPairResult[];
  updatePairs?: (input: string[]) => void;
};

const Chart: FC<Props> = ({
  pair,
  p2pPair,
  singleCurrency,
  singleCurrencyStrapi,
  isLoading,
  update,
  updatePairs,
}) => {
  const [singleCoin] = useLang(['singleCoin']);

  const [isScriptReady, setIsScriptReady] = useState(false);
  const [chartProperty, setChartProperty] = useState('change_property');

  const { isDesktop } = useBreakpoint();

  if (!singleCurrency || isLoading || !singleCurrencyStrapi)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { p2p_tradeable } = singleCurrency.result;

  return (
    <section className="px-4 md:px-0">
      <Card classNames="md:mt-16 mt-8 shadow-medium">
        <div className="flex flex-col md:flex-row">
          {isDesktop && (
            <Calculator
              assetSymbol={singleCurrencyStrapi.data[0].attributes.symbol}
              update={update}
              updatePairs={updatePairs}
            />
          )}
          <div className="border-dark-100 border-r p-[0.2px] w-full lg:w-[calc(100%-400px)] mb-0">
            <div className="flex-col items-center justify-between gap-4 border-dark-100 px-4 py-4 flex md:flex-row md:px-4 md:py-2">
              <p className="text-base font-bold text-dark-600">
                {singleCoin.chart}{' '}
                {singleCurrencyStrapi.data[0].attributes.name} (
                {singleCoin.aniPrice}{' '}
                {singleCurrencyStrapi.data[0].attributes.symbol})
              </p>
              {p2p_tradeable ? (
                <RadioGroup
                  switchTheme
                  options={[
                    {
                      key: 'complex_property',
                      label: singleCoin.arzinjaMarket,
                      value: 'complex_property',
                    },
                    {
                      key: 'change_property',
                      label: singleCoin.globalMarket,
                      value: 'change_property',
                    },
                  ]}
                  defaultSelected={chartProperty}
                  onChange={setChartProperty}
                  className={{ wrapper: 'w-full md:w-[263px]' }}
                />
              ) : null}
            </div>
            <div className="pt-0 lg:pr-0 [&>*]:!border-none h-96 lg:h-[84.5%]">
              {chartProperty === 'change_property' ? (
                <TradingViewChart pair={pair || 'USDTUSD'} />
              ) : (
                <>
                  {p2pPair ? (
                    <>
                      <Script
                        src="/static/datafeeds/udf/dist/bundle.js"
                        strategy="lazyOnload"
                        onReady={() => {
                          setIsScriptReady(true);
                        }}
                      />
                      {isScriptReady && (
                        <ArzinjaChart
                          {...defaultWidgetProps}
                          symbol={p2pPair}
                        />
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Stat
          currency={singleCurrency.result}
          strapiData={singleCurrencyStrapi}
          update={update}
        />
      </Card>
      {!isDesktop && (
        <Calculator
          assetSymbol={singleCurrencyStrapi.data[0].attributes.symbol}
          update={update}
          updatePairs={updatePairs}
        />
      )}
    </section>
  );
};

export default Chart;
