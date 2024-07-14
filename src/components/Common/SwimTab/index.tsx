import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';

type Item = {
  id: string | number;
  label: string;
  href?: string;
};

interface Props {
  items: Item[];
  initial?: string | number;
  className?: string;
  itemClassName?: string;
  scrollCenter?: boolean;
  callback?: (id: string) => void;
}

const SwimTab: React.FC<Props> = ({
  items = [],
  initial,
  className = '',
  itemClassName = '',
  scrollCenter = false,
  callback = () => {},
}) => {
  const router = useRouter();
  const tabRef = useRef<HTMLDivElement | null>(null);
  const tabBorderRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState(initial);

  useEffect(() => {
    const offsetFromLeft = tabRef.current?.offsetLeft;
    if (tabBorderRef.current?.style != null) {
      tabBorderRef.current.style.transform = `translateX(${offsetFromLeft}px)`;
      tabBorderRef.current.style.transitionDuration = '0.3s';
      tabBorderRef.current.style.transitionTimingFunction =
        'cubic-bezier(0.25, 0.1, 0.25, 1)';
    }
  }, [router.pathname, activeTab]);

  useEffect(() => {
    const initialItem = items.find((item) => item.id === initial);
    if (!initialItem) return;
    handleClickItem(initialItem);
  }, [initial]);

  const handleClickItem = (item: Item) => {
    if (item.href) {
      if (item.href === router.pathname) return;
      router.push(item.href);
    } else {
      if (item.id === activeTab) return;
      setActiveTab(item.id);
    }
  };

  useEffect(() => {
    if (!activeTab) return;
    callback(activeTab.toString());
  }, [router.pathname, activeTab]);

  const isActive = (item: Item) => {
    if (item.href) {
      return router.pathname === item.href;
    }
    return activeTab === item.id;
  };

  useEffect(() => {
    if (!scrollCenter) return;
    const target = items.find((i) => i.id === activeTab);
    const element = document.getElementById(String(target?.id));
    if (element == null) return;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeTab]);

  return (
    <div
      className={clsx(
        'relative flex select-none items-center justify-between',
        className,
      )}
    >
      {items.map((item) => (
        <span
          id={String(item.id)}
          key={item.id}
          ref={isActive(item) ? tabRef : null}
          className={clsx(
            'w-full cursor-pointer pb-4 pt-6 text-center font-medium',
            isActive(item) ? 'text-primary-500' : 'text-dark-500',
            itemClassName,
          )}
          onClick={() => {
            handleClickItem(item);
          }}
        >
          {item.label}
        </span>
      ))}
      <div
        ref={tabBorderRef}
        style={{ width: `${(1 / items.length) * 100}%` }}
        className="absolute bottom-0 left-0 h-[2px] bg-primary-400 rounded-lg"
      />
    </div>
  );
};

export default SwimTab;
