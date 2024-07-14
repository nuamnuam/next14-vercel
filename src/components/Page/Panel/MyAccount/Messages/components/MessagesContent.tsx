import React, { PropsWithChildren, useState } from 'react';

import { Tabs } from '@/components';

import { useRouter } from 'next/router';
import { getLang } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';

const [messages] = getLang(['messages']);

const MessagesContent = ({ children }: PropsWithChildren) => {
  const [messages] = useLang(['messages']);

  const { isDesktop } = useBreakpoint();

  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(
    router.pathname.includes('announcement') ? 'announcement' : 'notification',
  );

  return (
    <div>
      <h2 className="hidden p-6 pr-0 pt-0 text-xl font-medium text-dark-600 lg:block">
        {messages.messages}
      </h2>
      <div className="rounded-md">
        <div className="flex flex-col items-center justify-between gap-6 py-6 px-3 lg:flex-row bg-white rounded-t-md">
          <Tabs
            items={tabItems}
            selected={selectedTab}
            onChange={(val: string) => {
              router.push({
                pathname: `/panel/my-account/messages/${val}`,
                query: !isDesktop ? 'modal=messages-content-modal' : '',
              });
              setSelectedTab(val);
            }}
            className="!pb-0"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default MessagesContent;

const tabItems = [
  {
    label: messages.activities,
    name: 'notification',
  },
  {
    label: messages.newsAndAnnouncements,
    name: 'announcement',
  },
];

export const messagesTabItems = (isDesktop: boolean = true) => [
  {
    title: messages.newsAndAnnouncements,
    name: 'announcement',
    generateIcon: (isActive = false) => null,
    href: `/panel/my-account/messages/announcement${
      !isDesktop ? '?modal=messages-content-modal' : ''
    }`,
  },
  {
    title: messages.activities,
    name: 'notification',
    generateIcon: (isActive = false) => null,
    href: `/panel/my-account/messages/notification${
      !isDesktop ? '?modal=messages-content-modal' : ''
    }`,
  },
];
