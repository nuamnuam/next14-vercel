import React from 'react';
import clsx from 'classnames';

import { Modal, Icon, Spinner } from '@/components/Common';
import { toPersianDigits } from '@/utils';
import { maskCardNumber } from '@/utils/card-number';
import { useModal } from '@/hooks/useModal';
import { IResponseCard } from '@/types/wallet';
import { useFiatDepositStore } from '@/store';
import { useBanks, useBreakpoint, useLang } from '@/hooks';

interface Props {
  cards?: IResponseCard[];
  isLoading: boolean;
}

export const cardsModalName = 'cards-modal';
const CardsModal: React.FC<Props> = ({ cards = [], isLoading = true }) => {
  const [myAccount] = useLang(['myAccount']);

  const { getCardLogo } = useBanks();

  const { closeSyncModal } = useModal(cardsModalName);
  const { isDesktop } = useBreakpoint();

  const { setSelectedCart } = useFiatDepositStore((state) => ({
    setSelectedCart: state.setSelectedCart,
  }));

  const handleClick = (card: IResponseCard) => {
    setSelectedCart(card);
    closeSyncModal();
  };

  return (
    <Modal
      sync
      name={cardsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      maxWidth={'382px'}
      contentAddtionalClassNames="px-6"
    >
      <div className="flex flex-col">
        <h2 className="lg:mx-4 lg:last:mt-4 mb-2 pb-4 text-center font-medium text-dark-500 md:mx-6 lg:my-0">
          {isDesktop ? myAccount.selectCard : myAccount.cardSelection}
        </h2>
        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div>
            {cards?.map((card, index) => (
              <div
                className={clsx(
                  'flex cursor-pointer items-center justify-between  border-t border-dark-50 pt-6',
                  index !== cards.length - 1 && 'pb-6',
                )}
                key={index}
                onClick={() => handleClick(card)}
              >
                <span className="dir-ltr flex-auto text-center font-medium text-dark-700">
                  {maskCardNumber(toPersianDigits(card.card_number))}
                </span>
                <div className="w-6">
                  <Icon icon={getCardLogo(card.card_number)} size={24} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CardsModal;
