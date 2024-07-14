import { IPagination } from './wallet';

export type OperationType = 'FD' | 'FW' | 'CD' | 'CW';
export type TicketStatusTypes = 1 | 2 | 3 | 4 | 5;

export interface TicketResultTypes {
  ticket_id: number;
  status: TicketStatusTypes;
  ticket_department_subject: string;
  operation: OperationType | null;
  transaction_id: number | null;
  created_at: string;
  updated_at: string;
  date_string: string;
}

export interface TicketsResponse {
  code: number;
  success: boolean;
  message: string;
  result: TicketResultTypes[];
  pagination: IPagination;
}

export interface DepartmentDropDown {
  label?: string;
  value?: string;
}
export interface SubjectDropDown {
  id?: number;
  title?: string;
}
export interface Department {
  department_id: number;
  department_title: string;
  subjects: SubjectDropDown[];
}

export interface UploadedFileType {
  uri: string;
  name: string;
  type: string;
  size: number | null | string;
}

export interface TicketStatusInfoProps {
  id: number | 1;
  created_at: string;
  updated_at: string | null;
  department_id: number | 1;
  subject_id: number | null;
  operation: string | null;
  transaction_id: string | null;
  status: TicketStatusTypes;
  ticket_department_subject?: string | null;
  ticketDefaultSubjectId?: number | null;
  hasReview?: boolean;
}

export interface DataResult {
  id: number | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;
  department_id: number | undefined;
  subject_id: number | undefined;
  operation: string | undefined;
  transaction_id: string | undefined;
  status: TicketStatusTypes;
  review?: {
    description: string;
    score: number;
    created_at: string;
  };
}

export interface RouteParams {
  ticket_department_subject?: string | undefined;
  ticketDefaultSubjectId?: number | undefined;
}
