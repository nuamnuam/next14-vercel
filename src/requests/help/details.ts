import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type HelpDetailsContentResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      titlenumber: string;
      slug: string;
      help_categories: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            priority: number;
            is_start: false;
            slug: string;
            icon: {
              data: {
                id: number;
                attributes: {
                  name: string;
                  alternativeText: string | null;
                  caption: string | null;
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
              };
            };
          };
        }>;
      };
      media: {
        data?: null | Array<{
          attributes: {
            ext?: string;
            url?: string;
            alternativeText?: string;
          };
        }>;
      };
    };
  }>;

  meta: {};
};

export type ErrorHelpDetailsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getHelpDetailsContent(id: string | undefined) {
  return Request.get<HelpDetailsContentResponse>(STRAPIENDPOINT.HELPS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'filters[slug][$eq]': id,
    },
  });
}

export function useHelpDetailsContent(id: string | undefined) {
  return useQuery<HelpDetailsContentResponse, ErrorHelpDetailsContentResponse>({
    queryKey: STRAPI.HELP_DETAILS(id),
    queryFn: getHelpDetailsContent(id),
    enabled: !!id,
  });
}
