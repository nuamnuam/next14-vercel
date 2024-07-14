import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'jalali-moment';
import clsx from 'classnames';

import {
  Modal,
  Icon,
  Button,
  Spinner,
  Clipboard,
  Alert,
} from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useCoinIcon, useLang } from '@/hooks';
import {
  externalData,
  toPersianDigits,
  toPrice,
  toStraightNumber,
} from '@/utils';
import { useTransactionDetails } from '@/requests/panel/wallet/getTransactionDetails';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { useRouter } from 'next/router';

export const cryptoTransitionDetailsModalName =
  'crypto-transition-details-modal';

const CryptoTransactionDetailsModal: React.FC = () => {
  const [wallet, global, tickets] = useLang(['wallet', 'global', 'tickets']);
  const router = useRouter();
  const { isPending: isLoading, data, mutateAsync } = useTransactionDetails();
  const { closeSyncModal, isSyncModalOpen } = useModal(
    cryptoTransitionDetailsModalName,
  );
  const getCoinIcon = useCoinIcon();

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
        title: wallet.coin,
        key: 'currency_symbol',
        value: (
          <div className="flex items-center gap-2">
            <span className="text-dark-700 font-medium">
              {data.currency_symbol}
            </span>
            <Image
              src={getCoinIcon(data)}
              height={20}
              width={20}
              alt={'currency'}
              onError={(e) => {
                //@ts-ignore
                e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
              }}
            />
          </div>
        ),
      },
      {
        title: wallet.transId,
        key: 'id',
        value: data.id,
      },
      {
        title: wallet.transId,
        key: 'operation',
        value: data.operation === 'withdraw' ? wallet.withdraw : wallet.deposit,
      },
      {
        title: wallet.network,
        key: 'network',
        value: data.network,
      },
      {
        title: wallet.commission,
        key: 'fee',
        value: Number(data.fee) >= 0 && (
          <div className="flex gap-2 items-center justify-end">
            <span>{data.currency_symbol}</span>
            <span>{toPrice(toStraightNumber(data.fee))}</span>
          </div>
        ),
      },
      {
        title: wallet.txid,
        key: 'txid',
        value: data.txid,
        link: data.txid,
        hasCopy: true,
      },
      {
        title: wallet.walletAddress,
        key: 'address',
        value: data.is_internal ? toPersianDigits(data.address) : data.address,
        hasCopy: true,
      },
      {
        title: wallet.tag,
        key: 'tag',
        value: data.tag,
        hasCopy: true,
      },
      {
        title: wallet.createdAt,
        key: 'created_at',
        value: toPersianDigits(
          moment(data.created_at).locale('fa').format('HH:mm:ss YYYY/MM/DD'),
        ),
      },
      {
        title: wallet.confirmedAt,
        key: 'confirmed_at',
        value: data?.confirmed_at
          ? toPersianDigits(
              moment(data.confirmed_at)
                .locale('fa')
                .format('HH:mm:ss YYYY/MM/DD'),
            )
          : '-',
      },
      {
        title: wallet.status,
        key: 'status',
        value: <TranactionStatus status={data.status} />,
      },
      {
        title: wallet.transType,
        key: 'is_internal',
        value: data.is_internal ? wallet.internal : wallet.external,
      },
    ];
  }, [data]);
  const onTicketClick = () => {
    const payload = {
      type: `C${data?.operation === 'withdraw' ? 'W' : 'D'}`,
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
      name={cryptoTransitionDetailsModalName}
      onClose={closeSyncModal}
      contentAddtionalClassNames="!pt-8"
      titleWrapperClassName="!pt-10 lg:!pl-10 !-mb-10 z-1 !pb-1 bg-white rounded-t-[13px]"
      headerClassNames=""
      hasCloseAction
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col items-center border-b border-dark-50 pb-4">
              <div className="rounded-[13px] p-2 bg-dark-50 mt-2">
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
                if (field.key === 'currency_symbol')
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 px-6 bg-dark-50 rounded-lg"
                    >
                      <span className="block w-1/2 text-sm font-medium text-dark-600">
                        {toPrice(data?.amount ?? 0)}
                      </span>
                      <div className="max-w-[50%] flex items-center justify-end gap-2">
                        {field.value}
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
                      {field.hasCopy && (
                        <Clipboard
                          size="sm"
                          type="copy"
                          variant="light"
                          text={field.value}
                        />
                      )}
                      {field.link && (
                        <Link
                          href={field.link}
                          target="_blank"
                          className="flex"
                        >
                          <Icon
                            icon="link-Filled"
                            className="text-dark-200"
                            size={12}
                          />
                        </Link>
                      )}
                      <span
                        className={clsx(
                          'break-all text-left text-xs text-dark-600',
                          field.hasCopy && field.link && 'w-[80%]',
                          field.hasCopy || (field.link && 'w-[90%]'),
                          !field.hasCopy && !field.link && 'w-[100%]',
                        )}
                      >
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

export default CryptoTransactionDetailsModal;
