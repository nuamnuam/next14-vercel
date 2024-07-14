import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'classnames';

import { useBreakpoint, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import {
  Alert,
  Card,
  Button,
  Icon,
  Chip,
  Modal,
  AlertCTA,
  RatingStar,
  BoxDivider,
  ResponsivePageHeader,
} from '@/components/Common';
import { useGetSingleTicketDataQuery } from '@/requests/ticket/getSingleTicketById';
import { externalData, getLang, toPersianDigits } from '@/utils';
import { type Variant } from '@/components/Common/Chip';
import { useGetDepartmentsById } from '@/requests/ticket/getDepartments';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useCloseTicket } from '@/requests/ticket/closeTicket';

import { ReferenceForm, ReplyForm } from './index';
import { TICKET_STATUS } from '../types';
import moment from 'jalali-moment';

const [tickets] = getLang(['tickets']);

export const TICKET_OPERATIONS = {
  CW: tickets.withdraw,
  FW: tickets.withdraw,
  CD: tickets.deposit,
  FD: tickets.deposit,
};

export const PUBLIC_API_GET_FILES = process.env.NEXT_PUBLIC_API_GET_FILES;

export const referenceModalName = 'reference-modal';
const cancelTicketModalName = 'cancel-ticket-modal';
export const replyModalName = 'reply-ticket-modal';

const TicketDetailsPageContent: React.FC = () => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();

  const [redirectedTicket, setRedirectedTicket] = useState<{
    type: 'CW' | 'CD' | 'FW' | 'FD';
    transactionId: string;
  }>();
  const { isDesktop } = useBreakpoint();

  const {
    showSyncModal: showReferenceModal,
    closeSyncModal: closeRefernceModal,
  } = useModal(referenceModalName);

  const {
    showSyncModal: showCancelTicketModal,
    closeSyncModal: closeCancelTicketModal,
  } = useModal(cancelTicketModalName);

  const { showSyncModal: showReplyModal, closeSyncModal: closeReplyModal } =
    useModal(replyModalName);

  const { showSyncModal: showCancelModal } = useModal(cancelTicketModalName);

  const { data, refetch } = useGetSingleTicketDataQuery(
    Number(router.query.id),
    router.isReady,
  );

  const { data: departmant } = useGetDepartmentsById(
    data?.result.department_id || 1,
    {
      enabled: !!data?.result.department_id,
    },
  );

  const { mutateAsync, isPending: isCancelling } = useCloseTicket(
    router.query.id?.toString()!,
  );

  useEffect(() => {
    const data = externalData.get();
    if (data?.type && data.type === 'ticket') {
      setRedirectedTicket(data.data);
      externalData.set(null);
    }
  }, []);

  const cancelTicket = async () => {
    await mutateAsync(router.query.id?.toString()!);
    return await refetch();
  };

  const transformedMessage = useCallback(() => {
    return data?.result.items.map(
      ({ creator, created_by, attachment, description, date_string }) => {
        return {
          user: creator,
          type: created_by,
          date: date_string,
          message: description,
          attachment,
        };
      },
    );
  }, [data]);

  const IS_TICKET_CLOSED = useMemo(
    () => data?.result.status === 4,
    [data?.result],
  );

  const IS_TICKET_CANCELED = useMemo(
    () => data?.result.status === 5,
    [data?.result],
  );

  const STATUS = useMemo(() => {
    return TICKET_STATUS[data?.result.status || 1];
  }, [data?.result]);

  const SUBJECT = useMemo(() => {
    console.log(departmant?.result, data?.result);
    return departmant?.result.find(({ id }) => id === data?.result.subject_id);
  }, [data?.result, departmant]);

  return (
    <>
      <ResponsivePageHeader
        title={`${tickets.ticket} ${toPersianDigits(router.query?.id)}`}
        onBack={() => router.back()}
        extra={
          data?.result.status != 5 &&
          data?.result.status != 4 && (
            <Button variant="secondary" onClick={() => showCancelModal()}>
              {tickets.leaveTicket}
            </Button>
          )
        }
      />
      <div className="px-4 sm:px-8 lg:p-0">
        <Modal
          sync
          title={tickets.qc}
          name={referenceModalName}
          onClose={closeRefernceModal}
          headerIcon={'Exclamation-TwoTone'}
        >
          <ReferenceForm ticketId={router.query.id?.toString()!} />
        </Modal>
        <Modal
          sync
          title={tickets.replyToTicket}
          name={replyModalName}
          onClose={closeReplyModal}
          headerIcon={'Edit-TwoTone'}
        >
          <ReplyForm ticketId={router.query.id?.toString()!} />
        </Modal>
        <Modal
          sync
          title={tickets.leaveTicket}
          name={cancelTicketModalName}
          onClose={closeCancelTicketModal}
          headerIcon={'DeleteItem-TwoTone'}
        >
          <h3 className="text-dark-700 font-medium">
            {tickets.areYouSuteToCancelTicket}
          </h3>
          <div className="mt-6 flex justify-between items-center gap-x-4">
            <Button
              size="md"
              variant="text"
              onClick={() => closeCancelTicketModal()}
              className="h-12 bg-dark-500 [&>*]:text-white w-1/2"
            >
              {tickets.cancel}
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                cancelTicket();
                closeCancelTicketModal();
              }}
              className="h-12 w-1/2"
              isLoading={isCancelling}
            >
              {tickets.confirmCancel}
            </Button>
          </div>
        </Modal>
        {!data?.result.review && (IS_TICKET_CLOSED || IS_TICKET_CANCELED) ? (
          <AlertCTA
            message={tickets.qcNote}
            variant="info"
            className="mb-4 max-sm:[&>div]:flex-wrap max-sm:[&_.text-contain]:w-[calc(100%-28px)] max-sm:[&_button]:mt-2 max-sm:[&_button]:w-full"
            ctaTitle={tickets.qc}
            onClick={() => showReferenceModal()}
          />
        ) : null}

        {IS_TICKET_CLOSED ? (
          <Alert
            slug={{
              feature: 'ticket',
              section: 'detail',
            }}
          />
        ) : null}

        {IS_TICKET_CANCELED ? (
          <Alert
            message={tickets.canceledTicketNote}
            variant="warning"
            className="mb-8"
          />
        ) : null}

        <Card classNames="lg:pt-6 lg:pt-7 lg:pb-10 !bg-transparent lg:!bg-white">
          <section className="px-4 pt-6 lg:pt-0 !rounded-t-lg lg:!rounded-none lg:px-6 pb-6 lg:pb-0 flex justify-between items-center border-b border-b-dark-50 lg:border-none bg-white lg:bg-transparent">
            <div className="flex justify-start items-center gap-x-4">
              <h2 className="text-base text-dark-800">
                {SUBJECT?.department_title} | {SUBJECT?.subject}
              </h2>
              <Chip
                variant={STATUS.variant as Variant}
                classNames="[&>span]:font-medium hidden lg:flex"
                label={STATUS.text}
              />
            </div>
            <div className="hidden lg:flex justify-end items-center gap-x-4">
              {!IS_TICKET_CLOSED && !IS_TICKET_CANCELED ? (
                <Button
                  variant="dark"
                  startIcon={<Icon icon="CloseCircle-OutLined" size={16} />}
                  onClick={() => showCancelTicketModal()}
                >
                  {tickets.cancelTicket}
                </Button>
              ) : null}
              <Link href={'/panel/support/tickets'}>
                <Button
                  variant="secondary"
                  startIcon={<Icon icon="BurgerMenu-OutLined" size={16} />}
                >
                  {tickets.ticketList}
                </Button>
              </Link>
            </div>
          </section>

          <BoxDivider className="mt-7 hidden lg:block" />

          {/* <div className="lg:hidden bg-[#F2F4FA] h-6" /> */}
          <div className="">
            <section className="">
              <div className="py-6 px-4 lg:px-10 border-b border-dark-50 !rounded-b-lg lg:!rounded-none bg-white lg:bg-transparent">
                <div className=" w-full flex lg:flex-row flex-col justify-start items-center lg:gap-x-8 text-sm ">
                  <h3 className="w-full mt-0 mb-4 lg:my-4 lg:w-fit text-dark-300 flex justify-between lg:justify-start items-center lg:hidden">
                    {tickets.ticketStatus}:
                    <Chip
                      variant={STATUS.variant as Variant}
                      classNames="[&>span]:font-medium"
                      label={STATUS.text}
                    />
                  </h3>
                  <h3 className="w-fit text-dark-300 justify-start items-center hidden lg:flex">
                    {tickets.id}:
                    <span className="font-bold text-dark-600 lg:mr-2">
                      {toPersianDigits(data?.result?.id)}
                    </span>
                  </h3>
                  <h3 className="mt-0 mb-4 lg:my-0 w-full lg:w-fit text-dark-300 flex justify-between lg:justify-start items-center">
                    {tickets.createAt}:
                    <span className="font-bold text-dark-600 lg:mr-2">
                      {data?.result.created_at
                        ? toPersianDigits(
                            moment(data.result.created_at)
                              .locale('fa')
                              .format('HH:mm - YYYY/MM/DD'),
                          )
                        : '---'}
                    </span>
                  </h3>
                  <h3 className="w-full lg:w-fit text-dark-300 flex justify-between lg:justify-start items-center">
                    {tickets.lastUpdate1}:
                    <span className="font-bold text-dark-600 lg:mr-2">
                      {toPersianDigits(data?.result.date_string)}
                    </span>
                  </h3>
                </div>
                {data?.result?.operation && (
                  <div className="py-2 px-4 rounded-lg bg-primary-50 flex flex-col lg:flex-row gap-2 lg:gap-10 flex-1 mt-4">
                    {TICKET_OPERATIONS?.[
                      (data.result.operation as 'CD' | 'FD' | 'CW' | 'FW') ?? ''
                    ] && (
                      <div className="flex gap-2 justify-between lg:justify-start">
                        <span className="text-primary-600 text-sm">
                          {tickets.transType}:
                        </span>
                        <span className="text-primary-700 text-sm font-bold">
                          {
                            TICKET_OPERATIONS?.[
                              (data.result.operation as
                                | 'CD'
                                | 'FD'
                                | 'CW'
                                | 'FW') ?? ''
                            ]
                          }
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 justify-between lg:justify-start">
                      <span className="text-primary-600 text-sm">
                        {tickets.transId}:
                      </span>
                      <span className="text-primary-700 text-sm font-bold">
                        {toPersianDigits(data.result.transaction_id)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {data?.result?.review && (
                <div className="py-8 px-4 lg:px-10 bg-white lg:bg-transparent rounded-t-lg lg:rounded-none mt-8 lg:mt-0">
                  <div className="bg-blue-50 rounded-lg py-4 px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div>
                      <span className="text-blue-700 font-bold block mb-2">
                        {tickets.yourFeedback}
                      </span>
                      <span className="text-blue-600 font-medium text-sm">
                        {data?.result?.review?.description}
                      </span>
                    </div>
                    <RatingStar
                      rating={data?.result?.review?.score || 1}
                      totalStars={5}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
          {isDesktop && !IS_TICKET_CLOSED && !IS_TICKET_CANCELED && (
            <div className="border-b border-dark-50 pb-8">
              <ReplyForm ticketId={router.query.id?.toString()!} />
            </div>
          )}
          <section
            className={clsx(
              'lg:px-10 rounded-lg bg-white mt-8 lg:!mt-0 lg:pt-8  lg:bg-transparent ',
              data?.result?.review && '!mt-0',
            )}
          >
            <article>
              {transformedMessage()
                ?.reverse()
                ?.map(({ user, type, attachment, message, date }) => {
                  if (type === 'system')
                    return (
                      <div className="border-b-2 border-dark-50 lg:border-none w-full text-center relative py-4 lg:my-8 flex items-center justify-center after:absolute after:w-full after:h-[1px] after:border-b after:border-dark-100 after:border-dashed">
                        <div className="bg-white px-4 z-[1]">
                          <p
                            className={clsx(
                              'text-dark-900 leading-6 text-sm font-normal',
                            )}
                          >
                            {message}
                          </p>
                          <p className="text-dark-300 leading-6 text-xs font-normal">
                            {toPersianDigits(date)}
                          </p>
                        </div>
                      </div>
                    );
                  return (
                    <div
                      key={message}
                      className={clsx(
                        'flex justify-start lg:pb-8 flex-col',
                        type === 'user' ? 'items-start ' : 'items-end ',
                        !isDesktop &&
                          (type === 'user' ? 'bg-white' : 'bg-primary-50'),
                      )}
                    >
                      <figure
                        className={clsx(
                          'px-4 lg:px-0 pt-6 lg:pt-0 lg:mt-[9.5] cursor-pointer border-b-2 border-b-dark-50 lg:border-none w-full lg:w-fit',
                          type === 'user' ? 'justify-start' : 'justify-end',
                        )}
                      >
                        <div className="flex justify-between items-center lg:mb-4 lg:pr-16">
                          <h3
                            className={clsx(
                              'text-sm font-medium text-dark-600 ',
                              type === 'user'
                                ? 'text-dark-600'
                                : 'text-primary-600 lg:text-inherit',
                            )}
                          >
                            {user}
                          </h3>
                          <p
                            className={clsx(
                              'text-xs font-normal',
                              !isDesktop
                                ? type === 'user'
                                  ? 'text-dark-400'
                                  : 'text-primary-600'
                                : 'text-dark-400',
                            )}
                          >
                            {toPersianDigits(date)}
                          </p>
                        </div>
                        <div className="gap-x-4 flex items-start">
                          <Icon
                            icon={
                              type === 'user'
                                ? 'UserAccount-OutLined'
                                : 'Arzinja-Filled'
                            }
                            size={40}
                            className={clsx(
                              '!hidden lg:!block p-[10px] rounded-md [&>*]:fill-white',
                              type === 'user'
                                ? 'bg-[#B5BCDB]'
                                : 'bg-primary-500',
                            )}
                          />
                          <figcaption
                            className={clsx(
                              'pb-6 pt-4 lg:p-4 lg:py-6 lg:px-8 relative w-full lg:w-[559px] rounded-md font-bold text-dark-700 text-base',
                              type === 'user'
                                ? 'bg-white lg:bg-dark-50'
                                : 'bg-primary-50',
                            )}
                          >
                            {isDesktop && (
                              <div
                                className={clsx(
                                  'absolute right-[-12px] top-[15%] h-3 w-3 -translate-x-1/2 rotate-45 transform',
                                  type === 'user'
                                    ? 'bg-dark-50'
                                    : 'bg-primary-50',
                                )}
                              ></div>
                            )}
                            <p
                              className="text-dark-600 leading-6 text-sm font-normal break-all"
                              dangerouslySetInnerHTML={{
                                __html: message?.replace(/\r\n/g, '<br>'),
                              }}
                            />
                            {attachment ? (
                              <a
                                className={clsx(
                                  'flex justify-start font-normal items-center mt-4 gap-x-2 text-xs break-all',
                                  type === 'user'
                                    ? 'text-dark-400'
                                    : 'text-primary-600',
                                )}
                                href={attachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icon icon="PaperClip-OutLined" size={12} />
                                <span>{tickets.attachedFile}</span>
                              </a>
                            ) : null}
                          </figcaption>
                        </div>
                      </figure>
                    </div>
                  );
                })}
            </article>
          </section>
        </Card>
        <ModalFooter fullScreen className="lg:hidden">
          <Button fullWidth onClick={() => showReplyModal()}>
            {tickets.replyToTicket}
          </Button>
        </ModalFooter>
      </div>
    </>
  );
};
export default TicketDetailsPageContent;
