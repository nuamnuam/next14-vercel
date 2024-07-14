//@ts-nocheck

import '@/styles/global.css';
import '@/styles/icomoon.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';

import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Script from 'next/script';
import {
  QueryClientProvider,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';
import NextNProgress from 'nextjs-progressbar';
import { IntlProvider } from 'react-intl';

import theme from '@/theme';
import ToastProvider from '@/components/ToastProvider';
import ModalProvider from '@/components/ModalProvider';
import type { AppPropsWithLayout } from '@/types/nextjs';
import { useBreakpoint, useMarkerIo } from '@/hooks';
import { Request } from '@/utils';
import usePwaGuide from '@/hooks/useIsPwa';

import { colors as designTokensColors } from '../designTokens/index';

const IGNORED_LIVE_CHAT_ROUTES = ['/splash', '/p2p/[symbol]'];

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { isDesktop } = useBreakpoint();
  const { remind } = usePwaGuide();

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  const [supportChatStatus, setSupportChatStatus] = useState<boolean>(true);

  const { locale, pathname } = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  useMarkerIo();

  const init = async () => {
    const response = await fetch(`/api/init?locale=${locale}`);
    const data = await response.json();

    setSupportChatStatus(Boolean(Number(data.live_chat_status)));
    globalThis.LIVE_CHAT_STATE = Boolean(Number(data.live_chat_status));

    globalThis.DEFAULT_COIN_IMG_URL = `${data.default_icon_base_url}/default-coin-img.svg`;

    globalThis.LANGUAGE_BASE_URL = data.lang_base_url;
  };

  const handleChatWidget = useCallback(() => {
    if (
      !supportChatStatus ||
      (pathname.includes('/panel') && !isDesktop) ||
      IGNORED_LIVE_CHAT_ROUTES.includes(pathname) ||
      remind
    ) {
      window.LiveChatWidget.call('hide');
    }
  }, [isDesktop, supportChatStatus, pathname, remind]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (Boolean(localStorage.getItem('pwa')) && !isDesktop) {
      Request.setPWA();
    } else {
      Request.resetPWA();
    }
  }, [isDesktop]);

  useEffect(() => {
    handleChatWidget();
  }, [handleChatWidget]);

  useEffect(() => {
    if (locale && typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  }, [locale]);

  useEffect(() => {
    if (!localStorage.getItem('app_version')) {
      localStorage.setItem('app_version', '1.0.0');
    }
  }, []);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then(() => {
              console.log('sw has been registred successfully');
            })
            .catch(() => console.log('sw registration has been failed'));
        });
      }
    }
  }, []);

  return (
    <>
      <IntlProvider locale={locale as string}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <NextNProgress color={theme.colors.arzinja[100]} />
            <ModalProvider>
              <ThemeProvider theme={materialTheme}>
                {getLayout(<Component {...pageProps} />)}
                <ToastProvider />
              </ThemeProvider>
            </ModalProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </IntlProvider>
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.__lc = window.__lc || {};
        window.__lc.license = 12638088;
        ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))`,
        }}
        async
      />
      <noscript>
        <a
          href="https://www.livechatinc.com/chat-with/12638088/"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          Chat with us
        </a>
        , powered by{' '}
        <a
          href="https://www.livechatinc.com/?welcome"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          LiveChat
        </a>
      </noscript>
    </>
  );
}

export default MyApp;

const materialTheme = createTheme({
  typography: {
    fontFamily: 'iransansX',
  },
  palette: {
    primary: {
      main: designTokensColors.arzinja[500],
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: parseInt(theme.screens.sm),
      md: parseInt(theme.screens.md),
      lg: parseInt(theme.screens.lg),
      xl: parseInt(theme.screens.xl),
    },
  },
});
