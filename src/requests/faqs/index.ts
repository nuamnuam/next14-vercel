import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type FaqsContentResponse = {
  data: [
    {
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
                data: Array<{
                  id: number;
                  attributes: {
                    name: string;
                    alternativeText: string;
                    caption: string;
                    width: number;
                    height: number;
                    formats: string;
                    hash: string;
                    ext: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl: string;
                    provider: string;
                    provider_metadata: string;
                    createdAt: string;
                    updatedAt: string;
                  };
                }>;
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
              blog_ids: string;
              page_content: {
                id: number;
                title: string;
                description: string;
              };
              video: Array<{
                id: number;
                title: string;
                cta: string;
                ctaUrl: string;
              }>;
            };
          };
        };
      };
    },
  ];

  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type ErrorFaqsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getFaqsContent(
  id?: number | undefined | string,
  page?: number,
  pageSize?: number,
) {
  return Request.get<FaqsContentResponse>(STRAPIENDPOINT.FAQS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'filters[faq_categories][slug]': id,
      'sort[0]=': 'updatedAt:desc',
    },
  });
}

export function useFaqsContent(
  id?: number | undefined | string,
  page?: number,
  pageSize?: number,
) {
  return useQuery<FaqsContentResponse, ErrorFaqsContentResponse>({
    queryKey: STRAPI.FAQS_CONTENT(id, page, pageSize),
    queryFn: getFaqsContent(id, page, pageSize),
  });
}

export function useFaqsContentWHID(
  id?: number | string,
  page?: number,
  pageSize?: number,
) {
  return useQuery<FaqsContentResponse, ErrorFaqsContentResponse>({
    queryKey: STRAPI.FAQS_CONTENT(id, page, pageSize),
    queryFn: getFaqsContent(id, page, pageSize),
  });
}

export function getFaqsContentByCategoryId(
  id?: number | string,
  page?: number,
  pageSize?: number,
) {
  return Request.get<FaqsContentResponse>(STRAPIENDPOINT.FAQS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'filters[faq_categories]': id,
      'sort[0]=': 'updatedAt:desc',
    },
  });
}

export function useFaqsContentByCategoryId(
  id?: number | string,
  page?: number,
  pageSize?: number,
) {
  return useQuery<FaqsContentResponse, ErrorFaqsContentResponse>({
    queryKey: STRAPI.FAQS_CONTENT(id, page, pageSize),
    queryFn: getFaqsContentByCategoryId(id, page, pageSize),
  });
}
