import React from 'react';
import Link from 'next/link';

import { CardsModal, Icon, ModalInput } from '@/components/Common';
import { cardsModalName } from '@/components/Common/CardsModal';
import { useModal } from '@/hooks/useModal';
import { useBankCardsQuery } from '@/requests/panel/wallet/getBankCards';
import { useFiatDepositStore } from '@/store';
import { maskCardNumber } from '@/utils/card-number';
import { toPersianDigits } from '@/utils';
import { useBanks, useLang } from '@/hooks';

interface Props {
  className?: string;
  showFee?: boolean;
  showIcon?: boolean;
  caption?: React.ReactElement;
}

const CardsInputModal: React.FC<Props> = ({ className, caption }) => {
  const [wallet] = useLang(['wallet']);

  const { getCardLogo } = useBanks();

  const { showSyncModal } = useModal(cardsModalName);

  const { isLoading, data } = useBankCardsQuery();

  const { selectedCard, setSelectedCart } = useFiatDepositStore((state) => ({
    selectedCard: state.selectedCard,
    setSelectedCart: state.setSelectedCart,
  }));

  return (
    <div className={className}>
      <ModalInput
        onClick={() => {
          showSyncModal();
        }}
        label={
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-dark-600">
              {wallet.cardNumber}
            </span>
            <Link
              href="/panel/wallet/bank-accounts?form=card"
              className="text-sm text-primary-600"
            >
              + {wallet.add}
            </Link>
          </div>
        }
        placeholder={wallet.selectCard}
        value={
          selectedCard ? (
            <div className="flex items-center gap-3 w-full">
              <span className="dir-ltr flex-auto text-left font-medium text-dark-700">
                {maskCardNumber(toPersianDigits(selectedCard.card_number))}
              </span>
              <div className="w-6">
                <Icon icon={getCardLogo(selectedCard.card_number)} size={24} />
              </div>
            </div>
          ) : (
            ''
          )
        }
      />
      {caption != null && caption}
      <CardsModal cards={data?.result} isLoading={isLoading} />
    </div>
  );
};

export default CardsInputModal;
