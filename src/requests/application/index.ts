import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { showToast } from '@/components/ToastProvider';

import { STRAPI } from '../endpoints';

export type ApplicationContentResponse = {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      Slider_SH: Array<{
        id: number;
        title: string;
        description: string;
      }>;

      Slider_SH_P2: Array<{
        id: number;
        title: string;
        media: {
          data: [
            {
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
            },
          ];
        };
      }>;
      Slider_SH_CTA: Array<{
        id: number;
        cta: string;
        ctaUrl: null;
      }>;

      Slider_Image: [
        {
          id: number;
          media: {
            data: [
              {
                id: number;
                attributes: {
                  name: string;
                  alternativeText: null;
                  caption: null;
                  width: number;
                  height: number;
                  formats: {
                    small: {
                      ext: string;
                      url: string;
                      hash: string;
                      mime: string;
                      name: string;
                      path: null;
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
                      path: null;
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
                  previewUrl: null;
                  provider: string;
                  provider_metadata: null;
                  createdAt: string;
                  updatedAt: string;
                };
              },
            ];
          };
        },
      ];
      Download_SH: {
        id: number;
        title: string | null;
        description: string | null;
      };
      Download_CM: Array<{
        id: number;
        title: string | null;
        url: null;
        media: {
          data: [
            {
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
                url: string | null;
                previewUrl: null;
                provider: string;
                provider_metadata: null;
                createdAt: string;
                updatedAt: string;
              };
            },
          ];
        };
        qrMedia: {
          data: [
            {
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
            },
          ];
        };
      }>;
      Download_DL: Array<{
        id: number;
        title: string;
        cta: string;
        ctaUrl: null;
        media: {
          data: [
            {
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
            },
          ];
        };
      }>;

      Intro_SH: {
        id: number;
        title: string;
        description: string;
      };
      Intro_IC_Features: Array<{
        id: number;
        title: string;
        description: string;
        media: {
          data: {
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
          };
        };
      }>;
      Intro_VB: {
        id: number;
        title: string;
        cta: string;
        ctaUrl: null;
        media: {
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
      Intro_IC_Fac: Array<{
        id: number;
        title: string | null;
        description: string | null;
        media: {
          data: {
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
              url: string | null;
              previewUrl: null;
              provider: string;
              provider_metadata: null;
              createdAt: string;
              updatedAt: string;
            };
          };
        };
      }>;

      Intro_SH2: Array<{
        id: number;
        title: string;
        description: string;
        cta: string;
        ctaUrl: null;
      }>;

      Roadmap_TL: Array<{
        id: number;
        title: string;
        description: string;
        date: string;
      }>;

      Roadmap_TL_LT: {
        id: number;
        title: string;
      };

      Intro_VB_VideoCode: null;

      Intro_VB_Video: {
        id: number;
        media: {
          data: Array<{
            id: number;
            attributes: {
              name: string;
              alternativeText: null;
              caption: null;
              width: null;
              height: null;
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
    };
  };
  meta: {};
};

export type ErrorApplicationContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getApplicationContent() {
  return Request.get<ApplicationContentResponse>(STRAPI.APPLICATION, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useApplicationContent() {
  return useQuery<ApplicationContentResponse, ErrorApplicationContentResponse>({
    queryKey: ['get-application'],
    queryFn: getApplicationContent(),
  });
}
