import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';

export type ReferralContentResponse = {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      faq_slug_cat: string;
      Slider_C: {
        id: number;
        title: string;
        media: {
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
      Slider_SH: {
        id: number;
        title: string;
        description: string;
        cta: string;
        ctaUrl: string;
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
      UpCB_SH: {
        id: number;
        title: string;
        description: string;
      };
      UpCB_IconCard: Array<{
        id: number;
        title: string;
        description: string;
        media: {
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
      }>;

      RewardCB_SH: {
        id: number;
        title: string;
        description: string;
      };
      MemberCB_SH: {
        id: number;
        title: string;
        description: string;
      };
      CallToAction: {
        id: number;
        title: string;
        description: string;
        cta: string;
        ctaUrl: string;
      };
      SliderTitle_SH: {
        id: number;
        title: string;
      };
    };
  };
  meta: {};
};

export type ErrorReferralContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

function getReferralContent() {
  return Request.get<ReferralContentResponse>(STRAPI.REFERRAL, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useReferralContent() {
  return useQuery<ReferralContentResponse, ErrorReferralContentResponse>({
    queryKey: ['get-referral'],
    queryFn: getReferralContent(),
  });
}
