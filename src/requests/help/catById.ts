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
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        priority: number;
        is_start: true;
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
        helps: {
          data: Array<{
            id: number;
            attributes: {
              title: string;
              description: string;
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
              titlenumber: string | null;
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
                    is_start: true;
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
                data: Array<{
                  id: number;
                  attributes: {
                    name: string;
                    alternativeText: string | null;
                    caption: string | null;
                    width: string | null;
                    height: string | null;
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
  return Request.get<HelpCatByIdContentResponse>(STRAPIENDPOINT.HELPS_CATS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'filters[slug][$eq]': id,
    },
  });
}

export function useHelpCatByIdContent(id: string | undefined) {
  return useQuery<HelpCatByIdContentResponse, ErrorHelpCatByIdContentResponse>({
    queryKey: STRAPI.HELP_CAT(id),
    queryFn: getHelpCatByIdContent(id),
    enabled: !!id,
  });
}
