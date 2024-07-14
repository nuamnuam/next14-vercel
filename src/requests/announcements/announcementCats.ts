import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';
import { STRAPI } from '@/constants/query-keys';

export type AnnouncementCatsContentResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      priority: number;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      slug: string;
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
      announcements: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            description: string;
            slug: string;
            dateTime: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            is_pin: true;
            Summary: string;
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

export type ErrorAnnouncementCatsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getAnnouncementCatsContent() {
  return Request.get<AnnouncementCatsContentResponse>(
    STRAPIENDPOINT.ANNOUNCEMENTS_CATS,
    {
      baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
      headers: {
        Authorization: '',
      },
    },
  );
}

export function useAnnouncementCatsContent() {
  return useQuery<
    AnnouncementCatsContentResponse,
    ErrorAnnouncementCatsContentResponse
  >({
    queryKey: STRAPI.ANNOUNCEMENT_CATS,
    queryFn: getAnnouncementCatsContent(),
  });
}
