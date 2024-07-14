// @ts-nocheck
import React, { useEffect, useRef, memo } from 'react';

type Props = {
  pair: string;
};

function TradingViewWidget({ pair }: Props) {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
        {
            "autosize": true,
            "symbol": "${pair}",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_legend": true,
            "save_image": true,
            "hide_volume": false,
            "support_host": "https://www.tradingview.com"
        }`;
    container.current.innerHTML = '';
    container.current.appendChild(script);
  }, [pair]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '100%', width: '100%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      ></div>
    </div>
  );
}

export default memo(TradingViewWidget);
