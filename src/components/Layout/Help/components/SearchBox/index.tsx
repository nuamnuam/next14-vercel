import React, { useRef, useState } from 'react';
import clsx from 'classnames';
import { useHelpPageContent } from '@/requests/help/page';
import { useHelpContent } from '@/requests/help';

import { useDebounceValue, useOutsideClick } from '@/hooks';
import { FormInput, Icon, Spinner } from '@/components/Common';
import SearchContent from './SearchContent';

const SearchBox = () => {
  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchContentRef = useRef<HTMLDivElement>(null);

  const { data: helpPage, isLoading: helpPageLoading } = useHelpPageContent();
  const debouncedSearch = useDebounceValue(searchValue, 500);
  const { data: searchResult } = useHelpContent({
    title: debouncedSearch,
  });

  if (!helpPage || helpPageLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const { cta, placeholder } = helpPage.data.attributes;

  useOutsideClick(searchContentRef, () => {
    setFocused(false);
  });

  return (
    <div className="z-10 mt-6 lg:mt-6 lg:pb-0 pb-6 flex w-full flex-col items-center justify-start gap-4 sm:w-auto sm:flex-row">
      <div className="relative w-full transition-all duration-300 sm:w-auto">
        <FormInput
          placeholder={placeholder}
          className="sm:w-[397px] lg:w-[416px]"
          onFocus={() => {
            setFocused(debouncedSearch.length > 0);
          }}
          value={searchValue}
          onChange={(val) => {
            setSearchValue(val);
            setFocused(debouncedSearch.length >= 0);
          }}
          hasClear
          fullWidth
          rightIcon={
            <Icon icon="Search-OutLined" size={16} className="text-dark-500" />
          }
        />
        <div
          ref={searchContentRef}
          className={clsx(
            'absolute top-14 z-10 grid w-full grid-rows-[0fr] rounded-lg bg-white shadow-card transition-all duration-200 ease-in',
            focused && debouncedSearch.length > 0 ? 'grid-rows-[1fr]' : '',
          )}
        >
          <div className="overflow-hidden">
            <div className="p-6">
              <SearchContent
                searchResult={debouncedSearch ? searchResult?.data : []}
                setFocused={setFocused}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
