import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { BLOGS } from '@/requests/endpoints';
import { Blog } from '@/types/blog';

export type SuccussBlogsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: Blog[];
};

export type ErrorBlogsResponse = {
  code: number;
  message: string;
  success: boolean;
};
interface Args {
  currency?: string;
}

export function getBlogs({ currency }: Args) {
  return Request.get<SuccussBlogsResponse>(BLOGS.DEFAULT, {
    params: currency
      ? {
          currency,
        }
      : {},
  });
}

export default function useBlogs(enabled: boolean = true, currency?: string) {
  return useQuery<SuccussBlogsResponse, ErrorBlogsResponse>({
    queryKey: ['get-blogs'],
    queryFn: getBlogs({ currency }),
    enabled,
  });
}
