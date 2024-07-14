import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI as STRAPIENDPOINT } from '../endpoints';
import { STRAPI } from '@/constants/query-keys';

export type AnnouncementsContentResponse = {
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
            slug: string;
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

  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type ErrorAnnouncementsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getAnnouncementsContent(
  id?: number | undefined | string,
  page?: number,
  pageSize?: number,
) {
  return Request.get<AnnouncementsContentResponse>(
    STRAPIENDPOINT.ANNOUNCEMENT_BY_CATEGORY_ID,
    {
      baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
      headers: {
        Authorization: '',
      },
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'filters[announcement_cats][slug]': id,
        'sort[0]=': 'dateTime:desc',
      },
    },
  );
}

export function useAnnouncementsContent(
  id?: number | undefined | string,
  page?: number,
  pageSize?: number,
) {
  return useQuery<
    AnnouncementsContentResponse,
    ErrorAnnouncementsContentResponse
  >({
    queryKey: STRAPI.ANNOUNCEMENTS(id, page),
    queryFn: getAnnouncementsContent(id, page, pageSize),
  });
}
