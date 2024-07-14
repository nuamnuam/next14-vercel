import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type FaqPageContentResponse = {
  data: {
    id: number;
    attributes: {
      title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      media: {
        data: {
          id: number;
          attributes: {
            name: string;
            alternativeText: string;
            caption: string;
            width: number;
            height: number;
            formats: {
              thumbnail: {
                ext: string;
                url: string;
                hash: string;
                mime: string;
                name: string;
                path: string;
                size: number;
                width: number;
                height: number;
              };
            };
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
        };
      };
    };
  };
  meta: {};
};

export type ErrorFaqPageContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getFaqPageContent() {
  return Request.get<FaqPageContentResponse>(STRAPIENDPOINT.FAQ_PAGE, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useFaqPageContent() {
  return useQuery<FaqPageContentResponse, ErrorFaqPageContentResponse>({
    queryKey: STRAPI.FAQ_PAGE,
    queryFn: getFaqPageContent(),
  });
}
