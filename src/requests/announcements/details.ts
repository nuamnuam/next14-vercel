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
      dateTime: string;
      createdAt: string;
      slug: string;
      updatedAt: string;
      publishedAt: string;
      is_pin: true;
      Summary: string;
      announcement_cats: {
        data: Array<{
          id: number;
          slug: string;
          attributes: {
            title: string;
            priority: number;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            is_updates: string;
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
  return Request.get<HelpDetailsContentResponse>(STRAPIENDPOINT.ANNOUNCEMENTS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'filters[slug][$eq]': id,
    },
  });
}

export function useAnnouncementDetailsContent(id: string | undefined) {
  return useQuery<HelpDetailsContentResponse, ErrorHelpDetailsContentResponse>({
    queryKey: STRAPI.ANNOUNCEMENT_DETAILS(id),
    queryFn: getHelpDetailsContent(id),
    enabled: !!id,
  });
}
