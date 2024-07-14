import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';

export type AnnouncementsResponse = {
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
      is_pin: null;
      announcement_cats: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            priority: number;
            createdAt: string;
            updatedAt: string;
            slug: string;
            publishedAt: string;
            is_updates: null;
            icon: {
              data: Array<{
                id: number;
                attributes: {
                  name: string;
                  alternativeText: null;
                  caption: null;
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

export type ErrorAnnouncementsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getAnnouncements() {
  return Request.get<AnnouncementsResponse>(STRAPI.ANNOUNCEMENTS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'pagination[pageSize]': 3,
      'sort[0]=': 'dateTime:desc',
    },
  });
}

export function useAnnouncements(enabled: boolean = true) {
  const api = useQuery<AnnouncementsResponse, ErrorAnnouncementsResponse>({
    queryKey: ['get-announcements'],
    queryFn: getAnnouncements(),
    enabled,
  });

  const sortedDatesa = api?.data?.data
    .sort((a, b) => {
      return (
        (new Date(b.attributes.updatedAt) as any) -
        (new Date(a.attributes.updatedAt) as any)
      );
    })
    .slice(0, 3);

  return { ...api, data: { ...api.data, data: sortedDatesa } };
}
