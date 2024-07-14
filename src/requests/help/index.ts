import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/constants/query-keys';

import { STRAPI as STRAPIENDPOINT } from '../endpoints';

export type HelpContentResponse = {
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
            priority: string;
            is_start: string;
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
      slug: string;
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

export type ErrorHelpContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

interface HelpContentParams {
  id?: number | undefined | string;
  page?: number;
  pageSize?: number;
  title?: string | undefined;
  enabled?: boolean;
}

export function getHelpContent({
  id,
  page,
  pageSize,
  title,
}: HelpContentParams) {
  return Request.get<HelpContentResponse>(STRAPIENDPOINT.HELPS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'filters[help_categories][slug]': id,
      'filters[title][$containsi]': title,
      'sort[0]=': 'updatedAt:desc',
    },
  });
}

export function useHelpContent({
  id,
  page,
  pageSize,
  title,
}: HelpContentParams) {
  return useQuery<HelpContentResponse, ErrorHelpContentResponse>({
    queryKey: ['get-Help', id, page, pageSize, title],
    queryFn: getHelpContent({ id, page, pageSize, title }),
  });
}

export type FaqContentResponse = {
  data: Array<{
    id: number;
    attributes: {
      answer: string;
      question: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      faq_categories: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            priority: number;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            icon: {
              data: [
                {
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
                },
              ];
            };
          };
        }>;
      };
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
            blog_ids: string;
            page_content: {
              id: number;
              title: string;
              description: string;
            };
            video: Array<{
              id: number;
              title: string;
              cta: string;
              ctaUrl: string;
            }>;
          };
        };
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

export type ErrorFaqContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getFaqContent() {
  return Request.get<FaqContentResponse>(STRAPIENDPOINT.FAQS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
    params: {
      'pagination[page]': 1,
      'pagination[pageSize]': 5,
      'sort[0]=': 'updatedAt:desc',
    },
  });
}

export function useFaqContent() {
  return useQuery<FaqContentResponse, ErrorFaqContentResponse>({
    queryKey: ['get-faq'],
    queryFn: getFaqContent(),
  });
}

export type AnnouncementContentResponse = {
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
      slug: string;
      Summary: string;
      announcement_cats: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            priority: number;
            createdAt: string;
            slug: string;
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

export type ErrorAnnouncementContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getAnnouncementContent() {
  return Request.get<AnnouncementContentResponse>(
    STRAPIENDPOINT.ANNOUNCEMENTS,
    {
      baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
      headers: {
        Authorization: '',
      },
      params: {
        'pagination[page]': 1,
        'pagination[pageSize]': 5,
        'sort[0]=': 'updatedAt:desc',
      },
    },
  );
}

export function useAnnouncementContent() {
  return useQuery<
    AnnouncementContentResponse,
    ErrorAnnouncementContentResponse
  >({
    queryKey: STRAPI.ANNOUNCEMENTS_HELPS,
    queryFn: getAnnouncementContent(),
  });
}
