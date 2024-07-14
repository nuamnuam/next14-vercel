import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type FaqCatsContentResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
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
      faqs: {
        data: Array<{
          id: number;
          attributes: {
            answer: string;
            question: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            currency: {
              data: string;
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
};

export type ErrorFaqCatsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getFaqCatsContent() {
  return Request.get<FaqCatsContentResponse>(STRAPIENDPOINT.FAQS_CATS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useFaqCatsContent() {
  return useQuery<FaqCatsContentResponse, ErrorFaqCatsContentResponse>({
    queryKey: STRAPI.FAQ_CATS,
    queryFn: getFaqCatsContent(),
  });
}
