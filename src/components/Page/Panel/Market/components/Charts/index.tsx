import React, { FC, useCallback, useState } from 'react';
import Script from 'next/script';

import { ArzinjaChart, Button, Chip, TradingViewChart } from '@/components';

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from '../../../../../../../public/static/charting_library/charting_library';
import { useLang } from '@/hooks';

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

const CHARTS_TYPES = {
  ARZINJA: 'arzinja',
  WORLD: 'world',
};

type Props = {
  baseAsset: string;
  quoteAsset: string;
};

const Charts: FC<Props> = ({ baseAsset, quoteAsset }) => {
  const [market] = useLang(['market']);

  const [isScriptReady, setIsScriptReady] = useState(false);
  const [selected, setSelected] = useState(CHARTS_TYPES.ARZINJA);

  const renderContent = useCallback(() => {
    switch (selected) {
      case CHARTS_TYPES.ARZINJA:
        return (
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
                symbol={`${baseAsset}${quoteAsset}`}
              />
            )}
          </>
        );
      case CHARTS_TYPES.WORLD:
        return (
          <TradingViewChart
            pair={baseAsset === 'USDT' ? `USDTUSD` : `BINANCE:${baseAsset}USDT`}
          />
        );
      default:
        return '';
    }
  }, [selected, baseAsset, quoteAsset, isScriptReady]);

  return (
    <div className="bg-white md:rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-dark-50">
        <div className="flex gap-4">
          <Button
            variant={selected === CHARTS_TYPES.ARZINJA ? 'secondary' : 'text'}
            onClick={() => setSelected(CHARTS_TYPES.ARZINJA)}
          >
            {market.arzMarket}
          </Button>
          <Button
            variant={selected === CHARTS_TYPES.WORLD ? 'secondary' : 'text'}
            onClick={() => setSelected(CHARTS_TYPES.WORLD)}
          >
            {market.worldMarket}
          </Button>
        </div>
        <Chip
          label={`${market.about} ${baseAsset}`}
          variant="info"
          classNames="hidden lg:flex w-fit"
          onClick={() => {
            window.open(`/${baseAsset}`, '_blank');
          }}
        />
      </div>
      <div className="h-[410px] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default Charts;
