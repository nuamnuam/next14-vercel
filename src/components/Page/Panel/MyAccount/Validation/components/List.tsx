import React from 'react';

interface IProps {
  items?: Array<{ title?: string; icon?: string }>;
  ItemComponent: (props: any) => JSX.Element;
  reFetchCards?: () => void;
  cardType?: string;
  responsiveStatus?: React.ReactNode;
}

const List = ({
  items,
  ItemComponent,
  reFetchCards = () => {},
  cardType,
  responsiveStatus,
}: IProps) => {
  return (
    <>
      {items?.map((item: any, i: number) => (
        <ItemComponent
          key={i}
          index={i}
          reFetchCards={reFetchCards}
          cardType={cardType}
          responsiveStatus={responsiveStatus}
          {...item}
        />
      ))}
    </>
  );
};
export default List;
