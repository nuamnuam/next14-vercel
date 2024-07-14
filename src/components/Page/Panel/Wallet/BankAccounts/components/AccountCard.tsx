import React, { type Dispatch, type SetStateAction } from 'react';
import classNames from 'classnames';

import List from './List';
import { ListLoader, BoxDivider } from '@/components/Common';

interface IProps {
  header?: React.ReactNode;
  itemComponent?: (props: any) => JSX.Element;
  title?: string;
  setDeleteId: Dispatch<SetStateAction<number>>;
  deleteId?: number;
  items?: any;
  className?: string;
  reFetchCards: (type: 'card' | 'iban') => void;
  cardType?: string;
  loading: boolean;
}

const AccountCard = ({
  header,
  items,
  itemComponent,
  className,
  reFetchCards,
  cardType,
  deleteId,
  setDeleteId,
  loading,
}: IProps) => {
  return (
    <div
      className={classNames(
        'w-full flex flex-col !justify-start bg-white lg:bg-transparent rounded-lg lg:rounded-none',
        className,
      )}
    >
      <div className="lg:mb-4">
        <div className="p-5 sm:p-6 lg:p-0">{header}</div>
      </div>
      <BoxDivider className="block lg:hidden" />
      {loading && (
        <div className="py-20 flex items-center justify-center">
          <ListLoader />
        </div>
      )}
      <div className="px-4 sm:px-6 lg:p-0">
        <List
          items={items}
          itemComponent={itemComponent}
          reFetchCards={reFetchCards}
          cardType={cardType}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
        />
      </div>
    </div>
  );
};

export default AccountCard;
