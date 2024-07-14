import { getLang } from '@/utils';
import { Html, Head, Main, NextScript } from 'next/document';

const [global] = getLang(['global']);

export default function Document() {
  return (
    <Html lang="en-AU" dir="rtl">
      <Head>
        <meta name="application-name" content="Arzinja" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Arzinja" />
        <meta
          name="description"
          content="ارزینجا | بزرگترین سامانه فروش و خرید بیت کوین و ارز دیجیتال"
        />
        <meta name="msapplication-TileColor" content="#00DF9A" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/images/512.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />

        <title>
          ارزینجا | بزرگترین سامانه فروش و خرید بیت کوین و ارز دیجیتال
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, user-scalable=no"
        />
        <meta name="description" content={global.documentTitle} />
      </Head>
      <body className="overflow-x-hidden bg-dark-50 font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
