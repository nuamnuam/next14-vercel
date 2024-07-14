import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import moment from 'jalali-moment';

import { Modal, Icon, Button, Spinner, Alert } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { externalData, toPersianDigits, toPrice } from '@/utils';
import { useTransactionDetails } from '@/requests/panel/wallet/getTransactionDetails';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import TomanIcon from '@/components/Icons/TomanIcon';
import { useLang } from '@/hooks';
import { useRouter } from 'next/router';

export const tomanTransitionDetailsModalName = 'toman-transition-details-modal';

const TomanTransactionDetailsModal: React.FC = () => {
  const [wallet, global, tickets] = useLang(['wallet', 'global', 'tickets']);
  const router = useRouter();
  const { isPending: isLoading, data, mutateAsync } = useTransactionDetails();
  const { closeSyncModal, isSyncModalOpen } = useModal(
    tomanTransitionDetailsModalName,
  );

  useEffect(() => {
    if (!isSyncModalOpen) return;
    const selectedItem = externalData.get();
    if (!selectedItem) return;
    mutateAsync(selectedItem.id);
  }, [isSyncModalOpen]);

  const fields = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: wallet.amount,
        key: 'amount',
        value: toPrice(data.amount),
      },
      {
        title: wallet.transId,
        key: 'id',
        value: data.id,
      },
      {
        title: wallet.operation,
        key: 'operation',
        value: data.operation === 'withdraw' ? wallet.withdraw : wallet.deposit,
      },

      {
        title: wallet.cardShebaNum,
        key: 'iban/card',
        value: data['iban/card'],
      },
      {
        title: wallet.trackingCode,
        key: 'reference_number',
        value: data.reference_number,
      },
      {
        title: wallet.commission,
        key: 'fee',
        value: toPrice(data.fee),
      },
      {
        title: wallet.date,
        key: 'created_at',
        value: toPersianDigits(
          moment(data.created_at).locale('fa').format('HH:mm:ss YYYY/MM/DD'),
        ),
      },
      {
        title: wallet.status,
        key: 'status',
        value: <TranactionStatus status={data.status} />,
      },
      {
        title: wallet.depositType,
        key: 'is_id_payment',
        value: data.is_id_payment ? wallet.idDeposit : wallet.fastDeposit,
      },
    ];
  }, [data]);

  const onTicketClick = () => {
    const payload = {
      type: `F${data?.operation === 'withdraw' ? 'W' : 'D'}`,
      transactionId: data?.id,
      subjectId: data?.ticket_default_subject_id,
      departmentId: data?.ticket_department_id,
      callbackUrl: router.pathname,
    };

    externalData.set({ type: 'ticket', data: payload });
    closeSyncModal();
  };

  return (
    <Modal
      sync
      name={tomanTransitionDetailsModalName}
      onClose={closeSyncModal}
      hasCloseAction
      contentAddtionalClassNames="!pt-2"
      titleWrapperClassName="!pt-10"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col items-center border-b border-dark-50 pb-4">
              <div className="rounded-[13px] p-2 bg-dark-50">
                <Icon
                  icon="Detail-OutLined"
                  size={24}
                  className="text-dark-200"
                />
              </div>
              <h2 className="mt-4 font-bold text-center text-dark-700">
                {wallet.transDetails}
              </h2>
            </div>
            <div>
              {fields.map((field, index) => {
                if (!field.value) return null;
                if (field.key === 'amount')
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 px-6 rounded-lg bg-dark-50"
                    >
                      <span className="block w-1/2 text-sm font-medium text-dark-600">
                        {field.value}
                      </span>
                      <div className="max-w-[50%] flex items-center justify-end gap-2">
                        <span className="text-sm text-dark-700 font-medium">
                          {global.irt}
                        </span>
                        <div className="w-5 h-5">
                          <TomanIcon width={20} />
                        </div>
                      </div>
                    </div>
                  );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between [&:not(:last-child)]:border-b border-dark-50 py-3"
                  >
                    <span className="block w-1/2 text-xs text-dark-300">
                      {field.title}
                    </span>
                    <div className="max-w-[50%] flex items-center justify-end gap-2">
                      <span className="break-words text-left text-xs text-dark-600 w-full">
                        {field.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-gold-1 py-2 px-4 rounded-lg flex items-center justify-between">
              <Alert
                message={global.needSupport}
                variant="warning"
                className="!p-0"
              />
              <Link
                href={
                  data?.ticket_id
                    ? `/panel/support/tickets/${data.ticket_id}`
                    : '/panel/support/new-ticket'
                }
              >
                <Button size="sm" variant="secondary" onClick={onTicketClick}>
                  {data?.ticket_id ? tickets.showTicket : tickets.submitTicket}
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TomanTransactionDetailsModal;
