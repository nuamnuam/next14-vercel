import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';

import { useHelpCatsContent } from '@/requests/help/cats';
import { Icon, Spinner } from '@/components/Common';
import { useHelpCatByIdContent } from '@/requests/help/catById';
import { useLang } from '@/hooks';

import MenuItem from '../Menu/MenuItem';
import { type MenuItemType } from './menuItems';
import { mapHelpCategories } from './RightMenu';

const ResponsiveMenu = () => {
  const [help] = useLang(['help']);

  const { query } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const { data: helpCategories, isLoading } = useHelpCatsContent();
  const { data: catById, isLoading: cateByIdLoading } = useHelpCatByIdContent(
    query.main === 'latest-help' ? undefined : (query.main as string),
  );

  useEffect(() => {
    setIsOpen(false);
  }, [query]);

  const isActive = (item: MenuItemType) => {
    if (!query.main) return false;
    return query.main === item.name;
  };

  const isAccordionActive = (item: MenuItemType) => {
    if (!query.main || item.children == null) return false;
    const childrenNames = item.children.map((i) => i.name);
    return childrenNames.includes(String(query.main));
  };

  if (!helpCategories || isLoading)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col cursor-pointer">
      <div
        className="flex w-full items-center justify-between gap-4 p-4"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <Icon icon="BurgerMenu-OutLined" size={20} className="text-dark-500" />
        {cateByIdLoading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <span className="text-sm font-medium text-dark-500">
            {query.main === 'latest-help'
              ? help.latestHelps
              : catById?.data[0].attributes.title}
          </span>
        )}

        <Icon
          icon="Down-OutLined"
          size={12}
          className="mr-auto text-dark-100"
        />
      </div>
      <div
        className={clsx(
          'grid grid-rows-[0fr] border-t-2 border-transparent transition-all duration-300 ease-in',
          isOpen && 'grid-rows-[1fr] !border-dark-50',
        )}
      >
        <div className="overflow-hidden">
          {mapHelpCategories(helpCategories.data).map((item) => {
            return (
              <MenuItem
                key={item.href}
                title={item.title}
                href={item.href}
                name={item.name}
                generateIcon={item.generateIcon}
                isActive={isActive(item)}
                isAccordionActive={isAccordionActive(item)}
                activeFilter={String(query.main)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
