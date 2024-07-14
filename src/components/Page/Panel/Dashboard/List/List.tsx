import React from 'react';

interface IProps {
  items?: Array<{ title?: string; icon?: string }>;
  cardType?: string;
  responsiveStatus?: React.ReactNode;
  hasBottomBorder?: boolean;
  schema?: string | null;
  ItemComponent: (props: any) => JSX.Element;
  reFetchCards?: () => void;
  handleChange?: (
    schema: string | null,
    key: string,
    value: string | boolean,
  ) => void;
}

const List = ({
  items,
  cardType,
  responsiveStatus,
  hasBottomBorder = false,
  schema = null,
  ItemComponent,
  reFetchCards = () => {},
  handleChange,
}: IProps) => {
  return (
    <>
      {items?.map((item: any, i: number) => (
        <>
          <ItemComponent
            key={i}
            index={i}
            reFetchCards={reFetchCards}
            cardType={cardType}
            responsiveStatus={responsiveStatus}
            schema={schema}
            handleChange={handleChange}
            itemKey={item?.key}
            {...item}
          />
          {hasBottomBorder && i !== items.length - 1 ? (
            <hr className="border-dark-100 bg-dark-50 w-full opacity-20" />
          ) : null}
        </>
      ))}
    </>
  );
};
export default List;
