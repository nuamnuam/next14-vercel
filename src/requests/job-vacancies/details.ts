import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';
import { STRAPI as STRAPIQueryKeys } from '@/constants/query-keys';

export type DetailsResponse = {
  data: {
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
        data: {
          id: number;
          attributes: {
            name: 'IconBox.svg';
            alternativeText: null;
            caption: null;
            width: number;
            height: number;
            formats: null;
            hash: string;
            ext: '.svg';
            mime: 'image/svg+xml';
            size: number;
            url: string;
            previewUrl: null;
            provider: 'local';
            provider_metadata: null;
            createdAt: string;
            updatedAt: string;
          };
        };
      };
    };
  };
  meta: {};
};

export type ErrorDetailsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

function getOpportunityDetailsPage(id: string) {
  return Request.get<DetailsResponse>(STRAPI.JOB_VACANCY_DETAILS(id), {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useOpportunityDetailsContent(id: string) {
  return useQuery<DetailsResponse, ErrorDetailsResponse>({
    queryKey: STRAPIQueryKeys.JOB_VACANCIES_DETAILS(id),
    queryFn: getOpportunityDetailsPage(id),
  });
}
