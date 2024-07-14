import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { STRAPI } from '../endpoints';

export type ContactUsContentResponse = {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      Header_SH: {
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
      ContactDetails_SH: {
        id: number;
        title: string;
        description: string;
      };
      ContactDetails_Title: [
        {
          id: number;
          title: string;
        },
      ];
      ContactDetails_des: Array<{
        id: number;
        title: string;
        media: {
          data: [
            {
              id: 50;
              attributes: {
                name: string;
                alternativeText: null;
                caption: null;
                width: 24;
                height: 24;
                formats: null;
                hash: string;
                ext: string;
                mime: string;
                size: 0.34;
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
      Location: {
        id: number;
        title: string;
      };
      ContactDetails_Ic: Array<{
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
    };
  };
};

export type ErrorContactUsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getContactUsContent() {
  return Request.get<ContactUsContentResponse>(STRAPI.CONTACT_US, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useContactUsContent(enabled: boolean = true) {
  return useQuery<ContactUsContentResponse, ErrorContactUsContentResponse>({
    queryKey: ['get-contact-us'],
    queryFn: getContactUsContent(),
    enabled,
  });
}
