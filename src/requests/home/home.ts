import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';

export type Attributes = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Slider_CC: Array<{
    id: number;
    title: string;
    description: string;
    cta: string;
    ctaUrl: string;
  }>;

  APP_MobBack: {
    id: number;
    media: {
      data: Array<{
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
      }>;
    };
  };
  APP_MobMedia: {
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
  };
  App_ASH: {
    id: number;
    title: string;
    description: string;
  };
  APP_IconCard: Array<{
    id: number;
    title: string;
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
  }>;

  APP_CardMarket: Array<{
    id: number;
    title: string;
    url: string;
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
    qrMedia: {
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
  }>;
  ContentBox_SH: {
    id: number;
    title: string;
    description: string;
  };
  ContentBox_IC: Array<{
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

  ContentBox_IC_Info: Array<{
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

  APP_DSH: {
    id: number;
    title: string;
    cta: string;
    ctaUrl: string;
  };

  Start2Trade: {
    id: number;
    title: string;
    description: string;
    cta: string;
    ctaUrl: string;
  };

  Banner_CB: Array<{
    id: number;
    description: string;
    title: string;
    cta: string;
    title2: string;
    ctaUrl: string;
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
  Competition_CTA: {
    id: number;
    cta: string;
    ctaUrl: string;
  };
  Blog_SH: {
    id: number;
    title: string;
    description: string;
    cta: string;
    ctaUrl: string;
  };
};
export type SliderContentResponse = {
  data: {
    id: number;
    attributes: Attributes;
  };
  meta: {};
};

export type ErrorSliderContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getLandingContent() {
  return Request.get<SliderContentResponse>(STRAPI.HOME, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useLandingContent(enabled: boolean = true) {
  return useQuery<SliderContentResponse, ErrorSliderContentResponse>({
    queryKey: ['get-slider'],
    queryFn: getLandingContent(),
    enabled,
  });
}
