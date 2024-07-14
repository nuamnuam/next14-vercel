import React from 'react';
import { Icon, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import Link from 'next/link';
import { BalanceCoinModel } from '@/types/wallet';
import { useLang } from '@/hooks';

export const fastTransactionModalName = 'fast-tranaction-modal';
const FastTansactionModal: React.FC<{ data?: BalanceCoinModel }> = ({
  data,
}) => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal } = useModal(fastTransactionModalName);

  return (
    <Modal
      sync
      name={fastTransactionModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
    >
      <div className="border-b border-dark-50 py-4">
        {data?.otc_tradeable || data?.symbol === 'IRT' ? (
          <Link
            href={
              data?.symbol === 'IRT'
                ? '/panel/instant-trade/buy?asset=USDT'
                : `/panel/instant-trade/buy?asset=${data?.symbol}`
            }
            className="flex items-center rounded-lg"
          >
            <Icon icon="Buy-OutLined" size={20} className="text-dark-200" />
            <span className="mr-2 block text-sm font-medium text-dark-700">
              {wallet.fastBuy}
            </span>
          </Link>
        ) : (
          <div className="flex items-center rounded-lg">
            <Icon icon="Buy-OutLined" size={20} className="text-dark-200" />
            <span className="mr-2 block text-sm font-medium text-dark-200">
              {wallet.fastBuy}
            </span>
          </div>
        )}
      </div>
      <div className="py-4">
        {data?.otc_tradeable || data?.symbol === 'IRT' ? (
          <Link
            href={
              data?.symbol === 'IRT'
                ? '/panel/instant-trade/sell?asset=USDT'
                : `/panel/instant-trade/sell?asset=${data?.symbol}`
            }
            className="flex items-center rounded-lg"
          >
            <Icon icon="Sell-OutLined" size={20} className="text-dark-200" />
            <span className="mr-2 block text-sm font-medium text-dark-700">
              {wallet.fastSell}
            </span>
          </Link>
        ) : (
          <div className="flex items-center rounded-lg">
            <Icon icon="Sell-OutLined" size={20} className="text-dark-200" />
            <span className="mr-2 block text-sm font-medium text-dark-200">
              {wallet.fastSell}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FastTansactionModal;
