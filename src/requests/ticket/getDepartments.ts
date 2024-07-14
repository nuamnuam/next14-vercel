import { useQuery } from '@tanstack/react-query';

import QUERY_KEYS from '@/constants/query-keys';
import { Request } from '@/utils';

import { TICKET } from '../endpoints';

export type SuccussDepartmentsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IDepartmentsResults[];
};

export interface IDepartmentsResults {
  department_id: number;
  department_title: string;
  subjects: Subject[];
  logo: string;
}

export interface Subject {
  id: number;
  title: string;
}

export type ErrorDepartments = {
  response: {
    data: {
      code: number;
      success: boolean;
      message: string;
      result: any;
    };
  };
};

export interface IResultDepartmentTypes {
  id: number;
  subject: string;
  department_title: string;
  ticket_department_id: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}
export interface GetDepartmentByIdTypes {
  code: number;
  success: boolean;
  message: string;
  result: IResultDepartmentTypes[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: {
      next: string | null;
    };
  };
}

export function getDepartments() {
  return Request.get<SuccussDepartmentsResponse>(TICKET.GET_DEPARTMENTS);
}

export function useGetDepartmentsQuery() {
  return useQuery<SuccussDepartmentsResponse, ErrorDepartments>({
    queryKey: QUERY_KEYS.GET_DEPARTMENTS,
    queryFn: getDepartments(),
  });
}

export function getDepartmentById(id: number) {
  return Request.get<GetDepartmentByIdTypes>(
    `${TICKET.GET_DEPARTMENT_BY_ID}${id}`,
  );
}

export function useGetDepartmentsById(id: number, options = {}) {
  return useQuery<GetDepartmentByIdTypes, ErrorDepartments>({
    queryKey: QUERY_KEYS.GET_DEPARTMENT_BY_ID,
    queryFn: getDepartmentById(id),
    ...options,
  });
}
