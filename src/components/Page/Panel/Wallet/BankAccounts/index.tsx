import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useBreakpoint, useLang } from '@/hooks';
import { useBankCardsQuery } from '@/requests/panel/wallet/getBankCards';
import { useBankIbansQuery } from '@/requests/panel/wallet/getBankIbans';

import { BankAccountList, AddCardPage } from './components';
import {
  Card,
  GuideButton,
  Icon,
  IconButton,
  BoxDivider,
} from '@/components/Common';

const BankAccounts: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const [page, setPage] = useState('list');
  const [formType, setFormType] = useState<'card' | 'iban'>('card');

  const {
    isLoading: cardsLoading,
    refetch: getBankCards,
    data: cards,
  } = useBankCardsQuery();
  const {
    isLoading: ibansLoading,
    refetch: getBankIbans,
    data: ibans,
  } = useBankIbansQuery();

  useEffect(() => {
    const { form } = router.query;

    if (!form) return;
    if (form === 'card') {
      setPage('add-card');
      setFormType('card');
      return;
    }
    if (form === 'iban') {
      setPage('add-card');
      setFormType('iban');
    }
  }, [router.query]);

  const reFetchCards = (type: 'card' | 'iban') => {
    getBankCards();
    getBankIbans();
  };

  const getPage = (pageName: string) => {
    switch (pageName) {
      case 'list':
        return (
          <BankAccountList
            setFormType={setFormType}
            setPage={setPage}
            page={page}
            cards={cards?.result ?? []}
            cardsLoading={cardsLoading}
            ibansLoading={ibansLoading}
            ibans={ibans?.result ?? []}
            reFetchCards={reFetchCards}
          />
        );
      case 'add-card':
        return (
          <AddCardPage
            formType={formType}
            setPage={setPage}
            reFetchCards={reFetchCards}
          />
        );
    }
  };

  const onHeaderBackClick = () => {
    if (page === 'list' || router.query?.form) return router.back();
    setPage('list');
  };

  return (
    <>
      {!isDesktop && (
        <Header
          page={page as 'list' | 'add-card'}
          formType={formType}
          onBackClick={onHeaderBackClick}
        />
      )}
      {page === 'list' ? (
        <Card classNames="!bg-transparent lg:!bg-white">
          <div className="px-6 py-7 hidden lg:flex justify-between items-center ">
            <span className="text-dark-800 font-medium">
              {wallet.bankAccounts}
            </span>
            <GuideButton />
          </div>
          <BoxDivider className="hidden lg:block" />
          <div className="px-4 sm:px-8 lg:px-12 lg:pt-7">{getPage(page)}</div>
        </Card>
      ) : (
        <div className="">{getPage(page)}</div>
      )}
    </>
  );
};

export default BankAccounts;

interface HeaderProps {
  page: 'list' | 'add-card';
  onBackClick: () => void;
  formType: 'iban' | 'card';
}

const Header: React.FC<HeaderProps> = ({ page, formType, onBackClick }) => {
  const [wallet] = useLang(['wallet']);

  return (
    <div className="bg-white border-b border-dark-100 p-4 mb-8 h-[76px]">
      <div className="flex items-center justify-between">
        <div
          className="flex gap-8 items-center justify-start cursor-pointer"
          onClick={onBackClick}
        >
          <Icon size={18} icon="Right-OutLined" className="text-dark-200" />
          <span className="text-dark-600 text-lg font-medium">
            {page === 'list'
              ? wallet.bankAccounts
              : formType === 'card'
              ? wallet.addCard
              : wallet.addIban}
          </span>
        </div>
        <IconButton
          size="lg"
          className="border-dark-200"
          icon={
            <Icon
              className="text-dark-600"
              icon="QuestionCircle-OutLined"
              size={20}
            />
          }
        />
      </div>
    </div>
  );
};
