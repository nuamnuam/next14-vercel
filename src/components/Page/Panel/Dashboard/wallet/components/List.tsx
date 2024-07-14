import React, { type Dispatch, type SetStateAction } from 'react';

interface IProps {
  items?: [];
  reFetchCards: () => void;
  itemComponent: any;
  cardType?: string;
  setDeleteId: Dispatch<SetStateAction<number>>;
  deleteId?: number;
}

const List = ({
  items,
  reFetchCards = () => {},
  itemComponent: ItemComponent,
  cardType,
  setDeleteId,
  deleteId,
}: IProps) => {
  return (
    <>
      {items?.map((item: any, i: number) => (
        <ItemComponent
          key={item.id}
          reFetchCards={reFetchCards}
          cardType={cardType}
          id={item.id}
          setDeleteId={setDeleteId}
          deleteId={deleteId}
          {...item}
        />
      ))}
    </>
  );
};
export default List;
