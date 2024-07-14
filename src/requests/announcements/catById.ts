import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type HelpCatByIdContentResponse = {
  data: [
    {
      id: number;
      attributes: {
        title: string;
        priority: number;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        is_updates: string | null;
        slug: string;
        icon: {
          data: Array<{
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
          }>;
        };
        announcements: {
          data: Array<{
            id: number;
            attributes: {
              title: string;
              description: string;
              dateTime: string;
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
              is_pin: true;
              Summary: string;
              titlenumber: string | null;
              slug: string;
            };
          }>;
        };
      };
    },
  ];
  meta: {};
};

export type ErrorHelpCatByIdContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getHelpCatByIdContent(id: string | undefined) {
  return Request.get<HelpCatByIdContentResponse>(
    STRAPIENDPOINT.ANNOUNCEMENTS_CATS,
    {
      baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
      headers: {
        Authorization: '',
      },
      params: {
        'filters[slug][$eq]': id,
      },
    },
  );
}

export function useAnnouncementCatByIdContent(id: string | undefined) {
  return useQuery<HelpCatByIdContentResponse, ErrorHelpCatByIdContentResponse>({
    queryKey: STRAPI.ANNOUNCEMENT_CAT(id),
    queryFn: getHelpCatByIdContent(id),
    enabled: !!id,
  });
}
