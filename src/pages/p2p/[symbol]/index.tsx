import { useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import dynamic from 'next/dynamic';

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from '../../../../public/static/charting_library/charting_library';

const ChartContainer = dynamic(
  async () => await import('@/components/Common/ArzinjaChartContainer'),
  { ssr: false },
);

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

const P2PChart = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  const router = useRouter();

  if (router.query.symbol)
    return (
      <div className="min-h-screen">
        <Script
          src="/static/datafeeds/udf/dist/bundle.js"
          strategy="lazyOnload"
          onReady={() => {
            setIsScriptReady(true);
          }}
        />
        {isScriptReady && (
          <div className="h-screen">
            <ChartContainer
              {...defaultWidgetProps}
              symbol={router.query.symbol as string}
            />
          </div>
        )}
      </div>
    );
  return <></>;
};

export default P2PChart;
