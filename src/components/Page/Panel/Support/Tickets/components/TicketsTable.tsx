import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Card,
  Chip,
  Icon,
  Alert,
  SelectInput,
  Button,
  Pagination,
  Table,
} from '@/components';
import { useTicketsQuery } from '@/requests/ticket/getAllTickets';
import { getLang, toPersianDigits } from '@/utils';
import { type Variant } from '@/components/Common/Chip';
import { type TableHeaderItem } from '@/components/TableLayout/types';

import { TICKET_STATUS } from '../types';
import { useLang } from '@/hooks';
import ModalFooter from '@/components/Common/Modal/ModalFooter';

const [tickets] = getLang(['tickets']);

const TicketsTable: React.FC = () => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [filterVal, setFilterVal] = useState('all');

  const { data, isLoading, isFetching } = useTicketsQuery({
    status: filterVal,
    page,
    hasInfinitScoll: false,
  });

  useEffect(() => {
    setPage(1);
  }, [filterVal]);

  const transformedData = useCallback(() => {
    return data?.result?.map(
      ({
        ticket_id,
        ticket_department_subject,
        updated_at,
        status,
        date_string,
      }) => {
        const STATUS = TICKET_STATUS[status || 1];
        return {
          id: toPersianDigits(ticket_id),
          topic: ticket_department_subject,
          updated_at: toPersianDigits(date_string),
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
              className="[&>*]:fill-dark-500 cursor-pointer"
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
    <section className="mb-8">
      <Alert
        slug={{
          feature: 'ticket',
          section: 'ticket-list',
        }}
      />
      <Card classNames="mt-6 md:mt-8">
        <div className="flex w-full items-center justify-between md:flex-row p-6">
          <p className="hidden md:block w-max text-base text-dark-800">
            {tickets.mysupportTickets}
          </p>
          <div className="flex items-center justify-end gap-x-5">
            <SelectInput
              name="sort"
              classNames="min-w-[170px]"
              options={options}
              value={filterVal}
              onChange={setFilterVal}
            />
            <Link href={'/panel/support/new-ticket'}>
              <Button startIcon={<Icon icon="Plus-OutLined" size={16} />}>
                {tickets.sendNewTicket}
              </Button>
            </Link>
          </div>
        </div>

        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          isLoading={isLoading}
          isFetching={isFetching}
          onRowClick={onRowClick}
        />
        {data && data.result?.length > 0 && (
          <div className="flex flex-col items-center justify-center p-4 sm:flex-row">
            <Pagination
              count={data.pagination?.total_pages ?? 1}
              onChange={(page) => setPage(page)}
              page={page}
              classNames="mb-4 sm:mb-0"
            />
          </div>
        )}
      </Card>
      <ModalFooter fullScreen className="md:hidden">
        <Link href={'/panel/support/new-ticket'}>
          <Button fullWidth>{tickets.sendNewTicket}</Button>
        </Link>
      </ModalFooter>
    </section>
  );
};

export default TicketsTable;

const headerItems: TableHeaderItem[] = [
  {
    title: tickets.id,
    name: 'id',
    width: 'w-6/12 lg:w-1/5',
    classNames: 'hidden md:block text-center',
    columnClassNames: 'text-center text-dark-600 text-xs ',
  },
  {
    title: tickets.sectionSubject,
    name: 'topic',
    width: 'w-5/12 lg:w-1/5',
    classNames: 'text-center',
    columnClassNames: 'text-center text-dark-600 text-xs ',
  },
  {
    title: tickets.lastUpdate1,
    name: 'updated_at',
    width: 'lg:w-1/5',
    classNames: 'text-center',
    columnClassNames: 'text-dark-600 text-xs text-center',
  },
  {
    title: tickets.status,
    name: 'status',
    classNames: 'flex justify-center',
    width: 'flex lg:w-1/5',
    columnClassNames: 'flex justify-center text-dark-600',
  },
  {
    title: '',
    name: 'actions',
    width: 'hidden lg:flex w-1/5',
    columnClassNames: 'justify-start sm:justify-center mt-4 sm:mt-0 flex ',
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
