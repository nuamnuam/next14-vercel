import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import clsx from 'classnames';
import { HelpContentResponse } from '@/requests/help';

import { Icon, Spinner } from '@/components/Common';
import { useHelpStore } from '@/store';
import { useLang } from '@/hooks';

interface SearchResultProps {
  searchResult: HelpContentResponse['data'] | undefined;
  setFocused: Dispatch<SetStateAction<boolean>>;
}

const SearchContent = ({ searchResult, setFocused }: SearchResultProps) => {
  const [global] = useLang(['global']);

  const { setHelpDetails } = useHelpStore();
  const router = useRouter();

  return (
    <div className="flex flex-col">
      {!searchResult ? (
        <div className="my-10 flex items-center justify-center">
          <Spinner />
        </div>
      ) : searchResult.length > 0 ? (
        <>
          <span className="mb-8 block text-center font-medium text-dark-700">
            {global.searchResult}
          </span>

          <div>
            <span className="mb-6 block font-medium text-dark-700">
              {global.foundAnnouncements}
            </span>
            <div className="max-h-[14rem] overflow-y-auto">
              {searchResult.map((item, index) => (
                <button
                  onClick={() => {
                    setFocused(false);

                    router
                      .push(
                        `/help/${item.attributes.help_categories.data[0].attributes.slug}/${item.attributes.slug}`,
                      )
                      .then(() => {
                        setHelpDetails({
                          title: item.attributes.title,
                          description: item.attributes.description,
                          media: item.attributes.media,
                        });
                      });
                  }}
                  className={clsx(
                    'flex items-center w-full justify-between py-3 leading-7',
                    index !== 0 && 'border-t border-dark-50 ',
                  )}
                >
                  <span
                    className="text-sm font-medium text-dark-600"
                    dangerouslySetInnerHTML={{ __html: item.attributes.title }}
                  />
                  <Icon
                    icon="Down-OutLined"
                    size={14}
                    className="rotate-90 text-dark-100"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <span className="text-sm font-medium text-dark-600 text-center">
          {global.notFoundAnyResult}
        </span>
      )}
    </div>
  );
};

export default SearchContent;
