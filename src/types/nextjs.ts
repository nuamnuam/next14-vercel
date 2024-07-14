import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

export type NextPageWithLayout<T = unknown> = NextPage<T> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
