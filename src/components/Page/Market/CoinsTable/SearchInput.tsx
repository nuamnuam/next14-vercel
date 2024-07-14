import React, { useEffect, useState } from 'react';

import { FormInput, Icon } from '@/components/Common';
import { useDebounceFunc, useLang } from '@/hooks';
import useMarketStore from '@/store/marketStore';

const SearchInput = () => {
  const [market] = useLang(['market']);

  const [text, setText] = useState<string | undefined>(undefined);

  const { set_search, reset_pairs, set_page } = useMarketStore();

  const searchFunc = useDebounceFunc(500, (text: string) => set_search(text));

  useEffect(() => {
    reset_pairs();
    set_page(1);
    searchFunc(text);
  }, [text]);

  return (
    <FormInput
      name="search-coin"
      maxLength={11}
      placeholder={market.searchCoin}
      value={text}
      onChange={(val) => {
        if (val === '') return setText(undefined);
        return setText(val);
      }}
      hasClear
      fullWidth
      size="sm"
      className="lg:!my-0"
      autoComplete="off"
      rightIcon={
        <Icon icon="Search-OutLined" size={16} className="text-dark-500" />
      }
    />
  );
};

export default SearchInput;
