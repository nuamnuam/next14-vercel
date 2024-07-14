import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';

export type CommissionContentResponse = {
  data: {
    id: number;
    attributes: {
      title: string;
      subTitle: string;
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

export type ErrorCommissionContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

function getCommissionContent() {
  return Request.get<CommissionContentResponse>(STRAPI.COMMISSION, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useCommissionContent() {
  return useQuery<CommissionContentResponse, ErrorCommissionContentResponse>({
    queryKey: ['get-commission'],
    queryFn: getCommissionContent(),
  });
}
