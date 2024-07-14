import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Modal, Icon, Button } from '@/components';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useCoinIcon, useLang } from '@/hooks';
import { useCryptoWithdrawStore } from '@/store';
import {
  externalData,
  toPersianDigits,
  toPrice,
  toStraightNumber,
} from '@/utils';

interface Props {
  withdrawType: 'internal' | 'external';
}

export const cryptoWithdrawResultModalName = 'crypto-withdraw-result-modal';
const CryptoWithdrawResultModal: React.FC<Props> = ({ withdrawType }) => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const [withdrawId, setWithdrawId] = useState(null);
  const { closeSyncModal, isSyncModalOpen } = useModal(
    cryptoWithdrawResultModalName,
  );
  const router = useRouter();
  const getCoinIcon = useCoinIcon();

  const { selectedCoin, selectedNetwork, withdrawValue, resetState } =
    useCryptoWithdrawStore();

  useEffect(() => {
    setWithdrawId(externalData.get());
  }, [externalData.get()]);

  const items = () => {
    const fields = [
      {
        key: wallet.transId,
        value: toPersianDigits(withdrawId),
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
              height={24}
              width={24}
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
        id: 'networkFee',
        key: wallet.networkFee,
        value: toPrice(toStraightNumber(selectedNetwork?.withdrawal_fee!)),
      },
      {
        key: wallet.withdrawAmount,
        value: toPrice(toStraightNumber(withdrawValue!)),
      },
    ];

    if (withdrawType === 'external') {
      fields.push({
        key: wallet.earnedAmount,
        value: toPrice(
          Number(withdrawValue) - Number(selectedNetwork?.withdrawal_fee ?? 0),
        ),
      });
    }

    return fields;
  };

  return (
    <Modal
      sync
      name={cryptoWithdrawResultModalName}
      onClose={() => {
        closeSyncModal();
        resetState();
      }}
      hasCloseAction={false}
      contentAddtionalClassNames=" !pt-8"
      maxWidth={382}
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center pb-4">
          <div className="rounded-[13px] ">
            <Icon
              icon="ClockCircle-Filled"
              size={48}
              className="[&>*]:fill-warning-500"
            />
          </div>
          <h2 className="mt-4 text-center font-bold text-warning-500">
            {wallet.yourRequestSubmitted}
          </h2>
        </div>
        <div className="py-4 text-sm leading-6 text-dark-700 text-center border-y-2 border-dark-50">
          {wallet.withdrawResultNote}
        </div>
        <div>
          {items().map((item) => {
            if (item.id === 'networkFee' && withdrawType === 'internal')
              return null;
            return (
              <div className="flex items-center justify-between py-3">
                <span className="block w-1/2 text-xs text-dark-300">
                  {item.key}
                </span>
                <span className="block max-w-[50%] break-words text-left text-xs text-dark-600">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <ModalFooter>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          fullWidth
          onClick={async () => await router.replace('/panel/wallet/my-wallet')}
          className="lg:mt-1"
        >
          {wallet.goToWallet}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CryptoWithdrawResultModal;
