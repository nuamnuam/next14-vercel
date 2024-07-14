import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';

export type LinksHeader2 = Array<{
  id: number;
  title: string;
  slug: string;
}>;

export type Link2 = Array<{
  id: number;
  cta: string;
  ctaUrl: string;
  title: string;
}>;

export type FooterResponse = {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      Support_CTA: {
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
      Support_CTA2: {
        id: number;
        cta: string;
        ctaUrl: string;
      };
      FooterBox_CB: {
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
      };
      FooterBox_Lable: {
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
      };
      Start_FB: Array<{
        id: number;
        title: string;
        description: string;
      }>;

      Help_IC: {
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
      };
      Help_IC_ctaUrl: string;
      SocialMedia_Title: Array<{
        id: number;
        title: string;
      }>;

      SocialMedia_Icon: Array<{
        id: number;
        link: string;
        description: string;
        icon: {
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

      CopyRight_Text: {
        id: number;
        title: string;
      };
      linksHeader: Array<{
        id: number;
        title: string;
      }>;
      link: Array<{
        id: number;
        cta: string;
        ctaUrl: string;
      }>;
      linksHeader2: LinksHeader2;
      link2: Link2;
    };
  };
  meta: {};
};

export type ErrorFooterResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getFooter() {
  return Request.get<FooterResponse>(STRAPI.FOOTER, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useFooter(enabled: boolean = true) {
  return useQuery<FooterResponse, ErrorFooterResponse>({
    queryKey: ['get-footer'],
    queryFn: getFooter(),
    enabled,
  });
}
