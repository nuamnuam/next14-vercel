import { getLang } from '@/utils';

const [tickets] = getLang(['tickets']);

export const TICKET_STATUS_DATA = [
  { value: 0, label: tickets.allTickets },
  { value: 1, label: tickets.userAnswer },
  {
    value: 2,
    label: tickets.waiting,
  },
  {
    value: 3,
    label: tickets.responedTickets,
  },
  {
    value: 4,
    label: tickets.closed,
  },
  {
    value: 5,
    label: tickets.cancelTicket,
  },
];

export const OPERATION_STRING = {
  FD: tickets.rialDeposit,
  FW: tickets.rialWithdraw,
  CD: tickets.cryptoDeposit,
  CW: tickets.cryptiWithdraw,
};

export const TICKET_STATUS = {
  1: {
    text: tickets.userAnswer,
    variant: 'info',
  },
  2: {
    text: tickets.waiting,
    variant: 'warning',
  },
  3: {
    text: tickets.responedTickets,
    variant: 'success',
  },
  4: {
    text: tickets.closed,
    variant: 'danger',
  },
  5: {
    text: tickets.cancelTicket,
    variant: 'secondary',
  },
};
