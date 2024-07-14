import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';
import { STRAPI as STRAPIQueryKeys } from '@/constants/query-keys';

export type OpportunitiesResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      more_cta: string;
      more_cta_url: string;
      send_cta: string;
      send_cta_url: string;
      is_external: false;
      description: string;
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
      summary: Array<{
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

export type ErrorOpportunitiesResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

function getOpportunitiesPage() {
  return Request.get<OpportunitiesResponse>(STRAPI.JOB_VACANCIES, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useOpportunitiesContent() {
  return useQuery<OpportunitiesResponse, ErrorOpportunitiesResponse>({
    queryKey: STRAPIQueryKeys.JOB_OPPORTUNITIES_LIST,
    queryFn: getOpportunitiesPage(),
  });
}
