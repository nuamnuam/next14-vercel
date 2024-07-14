import { useEffect, useState } from 'react';
import clsx from 'classnames';

import { TabsModel } from '@/components/Common/Tab';
import { Icon } from '@/components/Common';
import Link from 'next/link';

type TabContent = Array<TabsModel & { name: string }>;

interface Props {
  items: TabContent;
  activeItem: string;
  placeholder: string;
  onChange: (val: string) => void;
}

const ResponsiveMenu: React.FC<Props> = ({
  items,
  activeItem,
  placeholder,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [activeItem]);

  const isActive = (item: string) => item === activeItem;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm">
      <div
        className="flex w-full items-center justify-between gap-4 p-4"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <Icon icon="BurgerMenu-OutLined" size={20} className="text-dark-500" />
        <span className="text-sm font-medium text-dark-500">{placeholder}</span>
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
        <div className="overflow-hidden ">
          {items?.map((item) => {
            return item.link ? (
              <Link
                href={item.link}
                className="w-full"
                onClick={() => {
                  onChange(item.name);
                  item.tabOnClick?.();
                }}
              >
                <span
                  className={clsx(
                    'flex items-center border-b border-dark-50 py-3 pl-6 pr-3 text-sm text-dark-500 hover:bg-dark-50 font-medium',
                    isActive(item.name) && 'bg-dark-100',
                  )}
                >
                  {item.leftIcon && item.leftIcon}
                  <span className={clsx('mr-4', item.extraClassname)}>
                    {item.tabTitle}
                  </span>
                </span>
              </Link>
            ) : (
              <button className="w-full" onClick={() => onChange(item.name)}>
                <span
                  className={clsx(
                    'flex items-center border-b border-dark-50 py-3 pl-6 pr-3 text-sm text-dark-500 hover:bg-dark-50 font-medium',
                    isActive(item.name) && 'bg-dark-100',
                  )}
                >
                  {item.leftIcon && item.leftIcon}
                  <span className={clsx('mr-4', item.extraClassname)}>
                    {item.tabTitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
