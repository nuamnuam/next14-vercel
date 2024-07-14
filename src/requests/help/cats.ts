import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type HelpCatsContentResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      priority: number;
      is_start: boolean;
      slug: string;
      icon: {
        data: {
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
        };
      };
      helps: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            description: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            help_categories: {
              data: Array<{
                id: number;
                attributes: {
                  title: string;
                  createdAt: string;
                  updatedAt: string;
                  publishedAt: string;
                  priority: number;
                  is_start: true;
                  icon: {
                    data: {
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
                    };
                  };
                };
              }>;
            };
            media: {
              data: Array<{
                id: number;
                attributes: {
                  name: string;
                  alternativeText: string;
                  caption: string;
                  width: number;
                  height: number;
                  formats: {
                    small: {
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

export type ErrorHelpCatsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getHelpCatsContent() {
  return Request.get<HelpCatsContentResponse>(STRAPIENDPOINT.HELPS_CATS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useHelpCatsContent() {
  return useQuery<HelpCatsContentResponse, ErrorHelpCatsContentResponse>({
    queryKey: STRAPI.HELPS_CATS,
    queryFn: getHelpCatsContent(),
  });
}
