export type ResponseBody<T> = {
  data: T;
  success: boolean;
};

export type PaginatedResponseBody<T> = {
  data: T[];
  links: Array<{
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  }>;
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type QueryParams = {
  page?: string | string[];
  per_page?: string | string[];
  bookmark?: string | string[];
  postCategory?: string | string[];
  created_at?: string | string[];
  title?: string | string[];
  text?: string | string[];
  status?: string | string[];
  feature?: string | string[];
};
