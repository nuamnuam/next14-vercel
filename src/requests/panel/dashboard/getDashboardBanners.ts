import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';

export type DashboardBannersResponse = {
  data: [
    {
      id: number;
      attributes: {
        colorCode: string;
        createdAt: string;
        cta: string;
        ctaUrl: string;
        description: string;
        publishedAt: string;
        title: string;
        updatedAt: string;
        media: {
          data: {
            attributes: {
              alternativeText: string;
              caption: string;
              createdAt: string;
              ext: string;
              formats: string;
              hash: string;
              height: number;
              mime: string;
              name: string;
              previewUrl: string;
              provider: string;
              provider_metadata: string;
              size: number;
              updatedAt: string;
              url: string;
              width: number;
            };
            id: number;
          };
        };
      };
    },
  ];
  meta: {};
};

export type DashboardBannersError = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getDashboardBanners() {
  return Request.get<DashboardBannersResponse>(STRAPI.DASHBOARD_BANNERS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useDashboardBanners() {
  return useQuery<DashboardBannersResponse, DashboardBannersError>({
    queryKey: ['dashboard-banners'],
    queryFn: getDashboardBanners(),
  });
}
