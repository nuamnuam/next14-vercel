import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { STRAPI } from '../endpoints';

export type TermsContentResponse = {
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
          };
        };
      };
      BlogPost_Post: [
        {
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
        },
      ];
    };
  };
  meta: {};
};

export type ErrorTermsContentResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getTermsContent() {
  return Request.get<TermsContentResponse>(STRAPI.TERMS_AND_CONDITIONS, {
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL,
    headers: {
      Authorization: '',
    },
  });
}

export function useTermsContent() {
  return useQuery<TermsContentResponse, ErrorTermsContentResponse>({
    queryKey: ['get-terms'],
    queryFn: getTermsContent(),
  });
}
