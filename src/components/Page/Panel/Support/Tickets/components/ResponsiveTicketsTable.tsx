import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  Card,
  Chip,
  Icon,
  Alert,
  SelectInput,
  Table,
  Button,
} from '@/components';
import { useIntersectionObserver, useLang } from '@/hooks';
import { useTicketsQuery } from '@/requests/ticket/getAllTickets';
import { getLang, toPersianDigits } from '@/utils';
import { type Variant } from '@/components/Common/Chip';
import { type TableHeaderItem } from '@/components/TableLayout/types';

import { TICKET_STATUS } from '../types';
import ModalFooter from '@/components/Common/Modal/ModalFooter';

const [tickets] = getLang(['tickets']);

const ResponsiveTicketsTable: React.FC = () => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [filterVal, setFilterVal] = useState<string>('all');

  const { data, isLoading, isFetching } = useTicketsQuery({
    status: filterVal,
    page,
    hasInfinitScoll: true,
  });

  useEffect(() => {
    setPage(1);
  }, [filterVal]);

  useIntersectionObserver(elementRef, () => {
    if (isFetching) return;
    setPage((prev) => prev + 1);
  });
  const transformedData = useCallback(() => {
    const subject = (depSub: string) => {
      if (!depSub) return '';
      return depSub.split('-')?.[1] || depSub;
    };

    if (!data) return [];
    return data.result.map(
      ({ ticket_id, ticket_department_subject, status, date_string }) => {
        const STATUS = TICKET_STATUS[status || 1];
        return {
          id: (
            <span className="flex items-center justify-start text-dark-600 text-xs leading-5 font-normal">
              {toPersianDigits(ticket_id)}
            </span>
          ),
          topic: (
            <div className="flex flex-col">
              <span className="flex items-center justify-center text-dark-600 text-xs leading-5 font-normal">
                {subject(ticket_department_subject)}
              </span>
              <span className="flex items-center justify-center text-dark-400 text-xs leading-5 font-normal mt-1">
                {toPersianDigits(date_string)}
              </span>
            </div>
          ),
          status: (
            <Chip
              label={STATUS.text}
              variant={STATUS.variant as Variant}
              size="sm"
            />
          ),
          actions: (
            <Icon
              icon="Left-OutLined"
              className="[&>*]:fill-dark-400"
              size={16}
            />
          ),
        };
      },
    );
  }, [data]);

  const onRowClick = (rowIndex: number) => {
    if (data.result[rowIndex])
      router.push(`tickets/${data.result[rowIndex].ticket_id}`);
  };

  return (
    <section className="mb-14">
      <Alert
        slug={{
          feature: 'ticket',
          section: 'ticket-list',
        }}
      />
      <Card classNames="mt-6 md:mt-8">
        <div className="flex w-full items-center justify-between px-4 md:px-5 pb-6 md:pb-0 pt-6 md:flex-row lg:p-0">
          <p className="hidden md:block w-max text-base text-dark-800">
            {tickets.mysupportTickets}
          </p>
          <div className="flex items-center justify-end gap-x-5 w-full md:w-[446px] md:px-6 md:py-5">
            <SelectInput
              name="sort"
              fullWidth
              options={options}
              value={filterVal}
              onChange={setFilterVal}
              classNames="w-6/12"
            />
            <Link
              href={'/panel/support/new-ticket'}
              className="hidden md:flex justify-center items-center w-[280px] bg-primary-600 px-2 py-2  gap-x-1 rounded-md text-white"
            >
              <Icon icon="Plus-OutLined" size={16} />
              <span>{tickets.sendNewTicket}</span>
            </Link>
          </div>
        </div>
        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          isLoading={isLoading}
          isFetching={isFetching}
          hasNextPage={
            data &&
            data.pagination &&
            data.result.length < data.pagination.total
          }
          ref={elementRef}
          onRowClick={onRowClick}
        />
      </Card>
      <ModalFooter fullScreen>
        <Link href={'/panel/support/new-ticket'}>
          <Button fullWidth size="md">
            {tickets.sendNewTicket}
          </Button>
        </Link>
      </ModalFooter>
    </section>
  );
};

export default ResponsiveTicketsTable;

const headerItems: TableHeaderItem[] = [
  {
    title: tickets.id,
    name: 'id',
    width: 'w-1/12 pr-2',
    columnClassNames: 'flex justify-start',
    align: 'center',
  },
  {
    title: tickets.subjectUpdate,
    name: 'topic',
    width: 'w-6/12 text-center',
    columnClassNames: 'flex justify-center',
    align: 'center',
  },
  {
    title: tickets.status,
    name: 'status',
    classNames: 'justify-center',
    width: 'w-4/12 text-center',
    columnClassNames: 'flex justify-center [&_span]:whitespace-pre',
    align: 'center',
  },
  {
    title: '',
    name: 'actions',
    width: 'w-1/12',
    columnClassNames: 'justify-end sm:justify-end sm:mt-0 flex items-center',
    align: 'left',
  },
];

const options = [
  {
    label: tickets.allTickets,
    value: 'all',
  },
  {
    label: tickets.userAnswer,
    value: 1,
  },
  {
    label: tickets.waiting,
    value: 2,
  },
  {
    label: tickets.responedTickets,
    value: 3,
  },
  {
    label: tickets.closed,
    value: 4,
  },
  {
    label: tickets.cancelTicket,
    value: 5,
  },
];
