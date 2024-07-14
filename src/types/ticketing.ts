export interface ReferenceFormSchema {
  rating?: number;
  feedback: string;
}
export interface NewTicketFormSchema {
  subjectId: number;
  description: string;
  attachment?: any;
}

export interface ReplyTicketFormSchema {
  description: string;
  attachment?: any;
}
export interface ITicket {}
