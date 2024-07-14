import { memo, useEffect, useRef } from 'react';
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../public/static/charting_library';

const ArzinjaChart = (props: Partial<ChartingLibraryWidgetOptions>) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        process.env.NEXT_PUBLIC_API_BASE_URL + '/v1/trade/trading-view',
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: 'latestFirst',
        },
      ),
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      disabled_features: [
        'use_localstorage_for_settings',
        'header_resolutions',
        'timezone_menu',
        'accessible_keyboard_shortcuts',
        'left_toolbar',
        'timeframes_toolbar',
        'save_shortcut',
        'symbol_search_hot_key',
        'header_symbol_search',
      ],
      enabled_features: [],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: 'light',
      timezone: 'Asia/Tehran',
    };

    const chartWidget = new widget(widgetOptions);

    return () => {
      chartWidget.remove();
    };
  }, [props]);

  return (
    <>
      <div
        ref={chartContainerRef}
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      />
    </>
  );
};

export default memo(ArzinjaChart);
