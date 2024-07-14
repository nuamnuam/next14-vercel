import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { STRAPI } from '../endpoints';

export type MarketContentResponse = {
  data: {
    attributes: {
      BlogPost_Post: {
        description: string;
        id: number;
        title: string;
      };
      Header_SH: {
        id: number;
        title: string;
        media?: {
          data?: Array<{
            attributes: {
              alternativeText?: string;
              caption?: string;
              createdAt: string;
              ext: string;
              hash: string;
              height: number;
              mime: string;
              name: string;
              previewUrl?: string;
              provider: string;
              provider_metadata?: string;
              size: number;
              updatedAt: string;
              url: string;
              width: number;
            };
            id: string;
          }>;
        };
      };
      createdAt: string;
      publishedAt: string;
      updatedAt: string;
    };
  };
  meta: {};
};

export type ErrorMarketContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getMarketContent() {
  return Request.get<MarketContentResponse>(STRAPI.MARKET, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useMarketContentMutation() {
  return useQuery<MarketContentResponse, ErrorMarketContentResponse>({
    queryKey: ['get-market-content'],
    queryFn: getMarketContent(),
  });
}
