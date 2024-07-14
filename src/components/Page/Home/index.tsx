import dynamic from 'next/dynamic';
import { NextPageWithLayout } from '@/types/nextjs';

import { getLandingContent } from '@/requests/home/home';
import { getBlogs } from '@/requests/home/useBlogs';
import { getFooter } from '@/requests/home/footer';
import { getContactUsContent } from '@/requests/contact-us';
import { getAnnouncements } from '@/requests/home/announcements';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchLanguage } from '@/requests/language';
import { QUERY_KEYS } from '@/constants';
import { getSettings } from '@/hooks/ApiBase/useSettings';
import { getCurrencyList } from '@/requests/getCurrencyList';
import { fetchPairs } from '@/requests/advance-market/pairsQuery';
import { fetchCurrnecies } from '@/requests/market/currenciesMutation';
import { getCurrnecyMarket } from '@/hooks/ApiBase/useSingleCurrencyMarket';
import { getInfiniteCurrencyList } from '@/hooks/useInfiniteCurrencyList';
import { getTopCoins } from '@/requests/home/topCoin';

const HomePage = dynamic(
  async () => await import('@/components/Page/Home/Home'),
  {
    ssr: true,
  },
);

const LandingLayout = dynamic(
  async () => await import('@/components/Layout/Landing'),
  {
    ssr: true,
  },
);

const Home: NextPageWithLayout<any> = (props) => {
  return <HomePage {...props} />;
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LandingLayout
      footer_data={page.props.footer_data}
      contact_us={page.props.contact_us}
      isLoading={page.props.isLoading}
    >
      {page}
    </LandingLayout>
  );
};

export default Home;

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['get-slider'],
    queryFn: getLandingContent(),
  });

  const baseUrl = 'https://files-cdn-gb.arznj.com/public/public_languages';
  const locale = 'fa';

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TRANSLATION('global', locale),
    queryFn: () => fetchLanguage('global', baseUrl, locale),
  });

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TRANSLATION('home', locale),
    queryFn: () => fetchLanguage('home', baseUrl, locale),
  });

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TRANSLATION('menu', locale),
    queryFn: () => fetchLanguage('menu', baseUrl, locale),
  });

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TRANSLATION('wallet', locale),
    queryFn: () => fetchLanguage('wallet', baseUrl, locale),
  });

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TRANSLATION('instantMarket', locale),
    queryFn: () => fetchLanguage('instantMarket', baseUrl, locale),
  });

  await queryClient.prefetchQuery({
    queryKey: ['get-blogs'],
    queryFn: getBlogs({}),
  });

  await queryClient.prefetchQuery({
    queryKey: ['get-footer'],
    queryFn: getFooter(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['get-contact-us'],
    queryFn: getContactUsContent(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['get-announcements'],
    queryFn: getAnnouncements(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['settings'],
    queryFn: getSettings(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['currency-list', { q: 'IRT' }],
    queryFn: getCurrencyList({ q: 'IRT' }),
  });

  await queryClient.prefetchQuery({
    queryKey: ['currency-list', { q: 'BTC' }],
    queryFn: getCurrencyList({ q: 'BTC' }),
  });

  await queryClient.prefetchQuery({
    queryKey: ['top-coins', 'is_trend', 'desc'],
    queryFn: getTopCoins({
      sort_by: 'is_trend',
      sort_type: 'desc',
      per_page: 4,
      provider_type: 'otc',
    }),
  });

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.CURRENCIES({
      category_id: '',
      favorite: false,
      page: 1,
      search: '',
      sort_by: '',
      sort_type: '',
    }),
    queryFn: () =>
      fetchCurrnecies({
        category_id: undefined,
        favorite: undefined,
        page: 1,
        per_page: 10,
        provider_type: 'otc',
        search: undefined,
        sort_by: undefined,
        sort_type: undefined,
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.GET_PAIRS('', 1, 10, ''),
    queryFn: () =>
      fetchPairs({
        base_asset: undefined,
        page: 1,
        per_page: 10,
        provider_type: 'p2p',
        search: undefined,
      }),
  });

  // await queryClient.prefetchQuery({
  //   queryKey: [
  //     'single-currency-market',
  //     {
  //       baseAsset: 'BTC',
  //       providerType: 'otc',
  //     },
  //   ],
  //   queryFn: () =>
  //     getCurrnecyMarket({
  //       baseAsset: 'BTC',
  //       providerType: 'otc',
  //       search: undefined,
  //     }),
  // });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
