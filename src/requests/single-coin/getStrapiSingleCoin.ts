import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { STRAPI } from '../endpoints';

export interface SuccessCurrencySingleResponse {
  data: Array<{
    id: number;
    attributes: {
      symbol: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      name: string;
      name_en: string;
      page_title: string;
      blog_ids: null;
      page_content: {
        id: number;
        title: string;
        description: string;
      };
      video: Array<{
        id: number;
        title: string;
        cta: null;
        ctaUrl: null;
      }>;

      faqs: {
        data: Array<{
          id: number;
          attributes: {
            answer: string;
            question: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            faq_categories: {
              data: Array<{
                id: number;
                attributes: {
                  title: string;
                  priority: number;
                  createdAt: string;
                  updatedAt: string;
                  publishedAt: string;
                  icon: {
                    data: [
                      {
                        id: number;
                        attributes: {
                          name: string;
                          alternativeText: string;
                          caption: string;
                          width: number;
                          height: number;
                          formats: null;
                          hash: string;
                          ext: string;
                          mime: string;
                          size: number;
                          url: string;
                          previewUrl: null;
                          provider: string;
                          provider_metadata: null;
                          createdAt: string;
                          updatedAt: string;
                        };
                      },
                    ];
                  };
                };
              }>;
            };
            currency: {
              data: {
                id: number;
                attributes: {
                  symbol: string;
                  createdAt: string;
                  updatedAt: string;
                  publishedAt: string;
                  name: string;
                  name_en: string;
                  page_title: string;
                  blog_ids: null;
                  page_content: {
                    id: number;
                    title: string;
                    description: string;
                  };
                  video: [
                    {
                      id: number;
                      title: string;
                      cta: null;
                      ctaUrl: null;
                    },
                    {
                      id: number;
                      title: string;
                      cta: null;
                      ctaUrl: null;
                    },
                  ];
                };
              };
            };
          };
        }>;
      };
    };
  }>;

  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export type ErrorCurrencySingleResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function getCurrencySingleStrapi(symbol: string) {
  return Request.get<SuccessCurrencySingleResponse>(
    STRAPI.GET_SINGLE_CURRENCY(symbol),
    {
      baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
      headers: {
        Authorization: '',
      },
    },
  );
}

export function useCurrencySingleStrapi(symbol?: string) {
  const router = useRouter();
  const { coin } = router.query;

  const selectedSymbol = symbol || coin;

  return useQuery<SuccessCurrencySingleResponse, ErrorCurrencySingleResponse>({
    queryKey: ['get-currency-single-strapi', selectedSymbol],
    queryFn: getCurrencySingleStrapi(selectedSymbol as string),
    gcTime: 3000,
    enabled: !!(selectedSymbol && router.isReady),
    // onError: () => {
    //   router.push('/404');
    // },
  });
}
