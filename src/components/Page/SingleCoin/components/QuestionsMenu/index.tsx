import { FC, useMemo, useState } from 'react';

import Paper from '@/components/Common/Paper';
import { Spinner } from '@/components/Common';
import type { SuccessSingleCoinResponse } from '@/requests/single-coin';
import type { SuccessCurrencySingleResponse } from '@/requests/single-coin/getStrapiSingleCoin';
import { useLang } from '@/hooks';

import MenuItem from './MenuItem';
import { parseFaqData } from '../parseData';

type Props = {
  singleCurrency: SuccessSingleCoinResponse;
  singleCurrencyStrapi: SuccessCurrencySingleResponse;
  isLoading: boolean;
};

const QuestionsMenu: FC<Props> = ({
  singleCurrency,
  singleCurrencyStrapi,
  isLoading,
}) => {
  const [singleCoin] = useLang(['singleCoin']);
  const [selected, setSelected] = useState<number>(-1);

  if (!singleCurrency || isLoading || !singleCurrencyStrapi)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { faqs, name } = singleCurrencyStrapi.data[0].attributes;

  const FaqList = useMemo(() => {
    if (!faqs?.data?.length) return [];

    return parseFaqData(faqs.data);
  }, [faqs]);

  return (
    <Paper as="section" classNames="mx-4 md:mx-0 mt-6 flex flex-col">
      <p className="w-full border-b-2 border-b-dark-50 p-4 text-right text-base font-bold text-dark-700">
        {singleCoin.faq} {name}
      </p>

      <div className="w-full overflow-hidden">
        {FaqList.map((i, idx) => (
          <MenuItem
            key={idx}
            selected={selected}
            onSelect={(v) => setSelected((p) => (v === p ? -1 : v))}
            item={i}
          />
        ))}
      </div>
    </Paper>
  );
};

export default QuestionsMenu;
