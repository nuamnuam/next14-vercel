import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';
import { STRAPI } from '@/constants/query-keys';

export type AnnouncementPageContentResponse = {
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

export type ErrorAnnouncementPageContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getAnnouncementPageContent() {
  return Request.get<AnnouncementPageContentResponse>(
    STRAPIENDPOINT.ANNOUNCEMENT_PAGE,
    {
      baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
      headers: {
        Authorization: '',
      },
    },
  );
}

export function useAnnouncementPageContent() {
  return useQuery<
    AnnouncementPageContentResponse,
    ErrorAnnouncementPageContentResponse
  >({
    queryKey: STRAPI.ANNOUNCEMENT_PAGE,
    queryFn: getAnnouncementPageContent(),
  });
}
