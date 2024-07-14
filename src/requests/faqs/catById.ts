import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type HelpCatByIdContentResponse = {
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
            formats: string | null;
            hash: string;
            ext: string;
            mime: string;
            size: number;
            url: string;
            previewUrl: string | null;
            provider: string;
            provider_metadata: string | null;
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
                  blog_ids: string | null;
                  page_content: {
                    id: number;
                    title: string;
                    description: string;
                  };
                  video: Array<{
                    id: number;
                    title: string;
                    cta: string | null;
                    ctaUrl: string | null;
                  }>;
                };
              };
            };
          };
        }>;
      };
    };
  }>;
  meta: {};
};

export type ErrorHelpCatByIdContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getHelpCatByIdContent(id: string | undefined) {
  return Request.get<HelpCatByIdContentResponse>(STRAPIENDPOINT.FAQS_CATS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'filters[slug][$eq]': id,
    },
  });
}

export function useFaqCatByIdContent(id: string | undefined) {
  return useQuery<HelpCatByIdContentResponse, ErrorHelpCatByIdContentResponse>({
    queryKey: STRAPI.FAQ_CAT(id),
    queryFn: getHelpCatByIdContent(id),
    enabled: !!id,
  });
}
