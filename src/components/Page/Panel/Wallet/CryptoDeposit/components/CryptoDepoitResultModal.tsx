import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'classnames';

import { Modal, Icon, Button, Clipboard } from '@/components';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useCoinIcon, useLang } from '@/hooks';
import { useDepositStore } from '@/store';
import { toPrice } from '@/utils';

export const cryptoDepositResultModalName = 'crypto-deposit-result-modal';

const CryptoDepoitResultModal: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const router = useRouter();
  const getCoinIcon = useCoinIcon();
  const { isDesktop } = useBreakpoint();
  const { closeSyncModal } = useModal(cryptoDepositResultModalName);
  const { transactionId, selectedCoin, depositValue, txid, selectedNetwork } =
    useDepositStore((state) => ({
      transactionId: state.transactionId,
      selectedCoin: state.selectedCoin,
      depositValue: state.depositValue,
      selectedNetwork: state.selectedNetwork,
      txid: state.txid,
    }));

  const items = useMemo(() => {
    return [
      {
        key: wallet.transId,
        value: transactionId,
      },
      {
        key: wallet.currencyType,
        value: (
          <div className="flex items-center justify-end">
            <span className="block text-xxs text-dark-500">
              {selectedCoin?.symbol}
            </span>
            <span className="mx-2 block text-sm text-dark-700">
              {selectedCoin?.title}
            </span>
            <Image
              src={getCoinIcon(selectedCoin!)}
              width={24}
              height={24}
              alt={selectedCoin?.symbol || 'coin'}
              onError={(e) => {
                //@ts-ignore
                e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
              }}
            />
          </div>
        ),
      },
      {
        key: wallet.depositAmount,
        value: toPrice(depositValue || 0),
      },
      {
        key: wallet.txidHash,
        value: txid,
        link: (selectedNetwork?.tx_explorer ?? '') + txid,
        hasCopy: true,
      },
    ];
  }, [transactionId, selectedCoin, depositValue, txid]);

  return (
    <Modal
      sync
      name={cryptoDepositResultModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames=" !pt-8"
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center border-b border-dark-50 pb-4">
          <Icon
            icon="ClockCircle-Filled"
            size={48}
            className="[&>*]:fill-warning-500 mt-4"
          />
          <h2 className="mt-4 text-center font-bold text-warning-500">
            {wallet.yourRequestSubmitted}
          </h2>
        </div>
        <div className="py-4 text-sm leading-6 text-dark-700 ">
          <p className="mt-0 mb-4">{wallet.depositResultNote}</p>
        </div>
        <div>
          {items.map((item) => (
            <div className="flex items-center justify-between [&:not(:last-child)]:border-b border-dark-50 py-3">
              <span className="block w-1/2 text-xs text-dark-300">
                {item.key}
              </span>
              <div className="flex items-center gap-2 max-w-[50%]">
                {item.hasCopy && (
                  <Clipboard
                    size="sm"
                    type="copy"
                    variant="light"
                    text={item.value ?? ''}
                  />
                )}
                {item.link && (
                  <Link href={item.link} target="_blank" className="flex">
                    <Icon
                      icon="link-Filled"
                      className="text-dark-200"
                      size={12}
                    />
                  </Link>
                )}
                <span
                  className={clsx(
                    'break-words text-left text-xs text-dark-600',
                    item.hasCopy && item.link && 'w-[80%]',
                    item.hasCopy || (item.link && 'w-[90%]'),
                    !item.hasCopy && !item.link && 'w-[100%]',
                  )}
                >
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalFooter>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          fullWidth
          onClick={async () => await router.push('/panel/wallet/my-wallet')}
        >
          {wallet.goToWallet}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CryptoDepoitResultModal;
