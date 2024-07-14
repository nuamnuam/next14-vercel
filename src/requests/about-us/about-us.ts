import { useQuery } from '@tanstack/react-query';
import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';
import { showToast } from '@/components/ToastProvider';

export type AboutUsResponse = {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      Slider_SH: [
        {
          id: number;
          title: string;
          title_SH: string;
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
            };
          };
        },
      ];
      Slider_IC: Array<{
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

      Advantage_SH: Array<{
        id: number;
        title: string;
        description: string;
      }>;

      Advantage_IC: Array<{
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

      Goals_GB: [
        {
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
                formats: {
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
            };
          };
        },
        {
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
                formats: {
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
            };
          };
        },
      ];
      Roadmap_SH: Array<{
        id: number;
        title: string;
        description: string;
      }>;

      Roadmap_TM: Array<{
        id: number;
        title: string;
        description: string;
        date: string;
      }>;

      ArzinjaTeam_CB: {
        id: number;
        title: string;
        description: string;
        cta: string;
        ctaUrl: string;
      };
    };
  };
  meta: {};
};

export type ErrorAboutUsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

function getAboutUs() {
  return Request.get<AboutUsResponse>(STRAPI.aboutUs, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useGetAboutUs() {
  return useQuery<AboutUsResponse, ErrorAboutUsResponse>({
    queryKey: ['get-about-us'],
    queryFn: getAboutUs(),
  });
}
