import React, { FC, useEffect, useState } from 'react';

import { FormInput, Icon } from '@/components/Common';
import { useDebounceFunc, useLang } from '@/hooks';
import { useAdvanceMarketStore } from '@/store';

const SearchInput: FC = () => {
  const [market] = useLang(['market']);

  const [text, setText] = useState<string | undefined>(undefined);

  const { set_search, reset } = useAdvanceMarketStore();

  const searchFunc = useDebounceFunc(500, (text: string) => set_search(text));

  useEffect(() => {
    reset();
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
      className="mt-4 lg:!my-0"
      autoComplete="off"
      size="sm"
      rightIcon={
        <Icon icon="Search-OutLined" size={16} className="text-dark-500" />
      }
    />
  );
};

export default SearchInput;
