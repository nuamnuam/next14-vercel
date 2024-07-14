import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { useGetDepartmentsQuery } from '@/requests/ticket/getDepartments';
import {
  Alert,
  Card,
  Icon,
  SelectInput,
  Button,
  ListLoader,
  BoxDivider,
  ResponsivePageHeader,
} from '@/components/Common';
import NewTicketForm from './NewTicketForm';
import { externalData, toPersianDigits } from '@/utils';
import { TICKET_OPERATIONS } from './TicketDetailsPageContent';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';

const NewTicketPageContent: React.FC = () => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();
  const [redirectedTicket, setRedirectedTicket] = useState<{
    type: 'CW' | 'CD' | 'FW' | 'FD';
    transactionId: string;
    subjectId: number;
    departmentId: number;
    callbackUrl?: string;
  }>();
  const [selectedDepartment, setSelectedDepartment] = useState<
    number | undefined
  >(undefined);
  const { data, isLoading } = useGetDepartmentsQuery();

  useEffect(() => {
    const data = externalData.get();
    if (!data?.data?.departmentId) return;

    if (data?.type && data.type === 'ticket') {
      setRedirectedTicket(data.data);
      setSelectedDepartment(data?.data?.departmentId);
      externalData.set(null);
    }
  }, []);

  const shortenedTransId = useMemo(() => {
    if (!redirectedTicket?.transactionId) return;
    return (
      redirectedTicket.transactionId.toString()?.split('-')?.[1] ??
      redirectedTicket.transactionId
    );
  }, [redirectedTicket]);

  return (
    <>
      <ResponsivePageHeader
        title={tickets.sendNewTicket}
        onBack={() => router.back()}
      />
      <section className="px-4 sm:px-8 lg:p-0 pb-20 md:pb-0">
        <Alert
          slug={{
            feature: 'ticket',
            section: 'ticket-add',
          }}
        />
        <Card classNames="mt-6 sm:mt-8">
          <div className="px-6 py-8 hidden md:block">
            <div className="hidden md:flex justify-between items-center">
              <div>
                <h2 className="text-dark-800">{tickets.sendNewTicket}</h2>
                <h3 className="mt-2 text-2xs text-dark-600">
                  {tickets.selectTopicThenTicket}
                </h3>
              </div>
              <Link href={'/panel/support/tickets'}>
                <Button
                  startIcon={<Icon icon="BurgerMenu-OutLined" size={16} />}
                  variant="secondary"
                >
                  {tickets.ticketList}
                </Button>
              </Link>
            </div>
          </div>
          <BoxDivider className="md:block hidden" />
          <div className="py-6 px-4 sm:px-10 sm:py-8">
            <div className="md:mt-8 md:hidden">
              <SelectInput
                name="sort"
                fullWidth
                label={tickets.supportSection}
                options={
                  data?.result.map(({ department_id, department_title }) => {
                    return {
                      label: department_title,
                      value: department_id,
                    };
                  }) || []
                }
                disabled={!!redirectedTicket?.departmentId}
                value={selectedDepartment}
                onChange={(val) => setSelectedDepartment(Number(val))}
                classNames="w-full [&>span]:text-dark-600 [&>div.relative]:h-[48px]"
              />
            </div>
            <div className="hidden md:flex justify-start items-center mt-8 gap-8">
              {isLoading && (
                <div className="flex justify-center w-full">
                  <ListLoader className="!py-12" />
                </div>
              )}
              {data?.result.map(({ department_id, department_title, logo }) => (
                <figure
                  key={department_id}
                  onClick={() => {
                    if (redirectedTicket?.departmentId) return;
                    setSelectedDepartment(department_id);
                  }}
                  className={clsx(
                    'flex-1 cursor-pointer border rounded-md border-dark-100 py-6 px-2 flex flex-col justify-start items-center gap-y-3',
                    selectedDepartment === department_id &&
                      'border-primary-500 [&>*]:text-primary-500 [&_*]:fill-primary-500',
                    redirectedTicket?.departmentId && '!cursor-not-allowed',
                  )}
                >
                  <Icon
                    icon={logo}
                    size={32}
                    className={clsx(
                      selectedDepartment === department_id
                        ? '[&>*]:fill-primary-500'
                        : '[&>*]:fill-dark-200',
                    )}
                  />
                  <figcaption className="font-bold text-dark-700 text-sm">
                    {department_title}
                  </figcaption>
                </figure>
              ))}
            </div>
            {redirectedTicket?.transactionId && (
              <div className="mt-4 md:mt-6 py-2 px-4 rounded-lg bg-primary-50 flex flex-col md:flex-row gap-2 md:gap-10 flex-1">
                {TICKET_OPERATIONS?.[redirectedTicket?.type] && (
                  <div className="flex gap-2 justify-between md:justify-start">
                    <span className="text-primary-600 text-sm">
                      {tickets.transType}:
                    </span>
                    <span className="text-primary-700 text-sm font-bold">
                      {TICKET_OPERATIONS?.[redirectedTicket?.type ?? '']}
                    </span>
                  </div>
                )}
                <div className="flex gap-2 justify-between md:justify-start">
                  <span className="text-primary-600 text-sm">
                    {tickets.transId}:
                  </span>
                  <span className="text-primary-700 text-sm font-bold">
                    {toPersianDigits(shortenedTransId)}
                  </span>
                </div>
              </div>
            )}
            {selectedDepartment && (
              <div className="mt-2 md:mt-8">
                <NewTicketForm
                  submitCallback={redirectedTicket?.callbackUrl}
                  operation={redirectedTicket?.type}
                  transactionId={shortenedTransId}
                  defaultSubjectId={redirectedTicket?.subjectId}
                  subjects={
                    data?.result.find(
                      ({ department_id }) =>
                        selectedDepartment === department_id,
                    )?.subjects
                  }
                />
              </div>
            )}
          </div>
        </Card>
      </section>
    </>
  );
};

export default NewTicketPageContent;
