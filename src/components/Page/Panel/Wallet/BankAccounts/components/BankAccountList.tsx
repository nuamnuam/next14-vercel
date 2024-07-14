import React, { type FC, useState } from 'react';

import { useBreakpoint, useLang } from '@/hooks';
import { Button } from '@/components/Common';
import { type IResponseCard, type IResponseIban } from '@/types/wallet';

import { AccountCard, AccountItem } from './index';
import DeleteCardModal from './DeleteCardModal';
import DeleteIbanModal from './DeleteIbanModal';
import CardsOptionsModal from './CardsOptionsModal';
import IbansOptionsModal from './IbansOptionsModal';

interface Props {
  page?: string;
  setPage: (page: string) => void;
  setFormType: (page: 'card' | 'iban') => void;
  cards?: IResponseCard[];
  ibans?: IResponseIban[];
  reFetchCards: (type: 'card' | 'iban') => void;
  cardsLoading: boolean;
  ibansLoading: boolean;
}

const BankAccountList: FC<Props> = (props) => {
  const [global, myAccount, wallet] = useLang([
    'global',
    'myAccount',
    'wallet',
  ]);

  const {
    setPage,
    setFormType,
    cards,
    ibans,
    reFetchCards,
    cardsLoading,
    ibansLoading,
  } = props;
  const { isMobile } = useBreakpoint();
  const [deleteId, setDeleteId] = useState<number>(1);
  const cardsList = [
    {
      cardType: 'card',
      header: (
        <div className="flex w-full items-center justify-between">
          <p className="text-base font-medium leading-6 text-dark-800	">
            {myAccount.bankCards}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setFormType('card');
              setPage('add-card');
            }}
            size={isMobile ? 'sm' : 'lg'}
            className="!rounded-md sm:!rounded-lg"
          >
            + {global.add}
          </Button>
        </div>
      ),
      title: myAccount.bankCards,
      className: 'w-full flex-1',
      items: cards,
      loading: cardsLoading,
    },
    {
      cardType: 'iban',
      header: (
        <div className="flex w-full items-center justify-between">
          <p className="text-base font-medium leading-6 text-dark-800	">
            {wallet.ibans}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setFormType('iban');
              setPage('add-card');
            }}
            size={isMobile ? 'sm' : 'lg'}
            className="!rounded-md sm:!rounded-lg"
          >
            + {global.add}
          </Button>
        </div>
      ),
      title: myAccount.ibanNumber,
      className: 'w-full flex-1',
      items: ibans,
      loading: ibansLoading,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-y-8 lg:flex-row lg:gap-y-0 gap-x-10">
        {cardsList?.map((card) => (
          <AccountCard
            loading={card.loading}
            key={card.title}
            header={card.header}
            title={card.title}
            itemComponent={AccountItem}
            className={card.className}
            items={card.items}
            reFetchCards={reFetchCards}
            cardType={card.cardType}
            deleteId={deleteId}
            setDeleteId={setDeleteId}
          />
        ))}
      </div>
      <DeleteCardModal deleteId={deleteId} />
      <DeleteIbanModal deleteId={deleteId} />
      <CardsOptionsModal deleteId={deleteId} />
      <IbansOptionsModal deleteId={deleteId} />
    </>
  );
};

export default BankAccountList;
