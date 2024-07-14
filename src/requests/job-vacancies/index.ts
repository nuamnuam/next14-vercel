import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { STRAPI } from '@/requests/endpoints';
import { STRAPI as STRAPIQueryKeys } from '@/constants/query-keys';

export type JobVacanciesPageResponse = {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      Slider_TSH: {
        id: number;
        title: string;
      };
      Slider_SH: {
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
      };
      Values_T: {
        id: number;
        title: string;
      };
      Values_IC: [
        {
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
        },
      ];
      Why_SH: {
        id: number;
        title: string;
        description: string;
      };
      Why_IC: [
        {
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
        },
      ];
      Opportunity_SH: {
        id: number;
        title: string;
        description: string;
      };
      SocialMedia_SH: {
        id: number;
        title: string;
        description: string;
      };
      SocialMedia_Icon: Array<{
        id: number;
        link: string;
        description: string;
        icon: {
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
  };
  meta: {};
};

export type ErrorJobVacanciesPageResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

function getJobVacanciesPage() {
  return Request.get<JobVacanciesPageResponse>(STRAPI.JOB_VACANCIES_PAGE, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useJobVacanciesPageContent() {
  return useQuery<JobVacanciesPageResponse, ErrorJobVacanciesPageResponse>({
    queryKey: STRAPIQueryKeys.JOB_VACANCIES_PAGE,
    queryFn: getJobVacanciesPage(),
  });
}
