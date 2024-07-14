import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { Button, EmptyTable, Spinner } from '@/components/Common';
import {
  type Message,
  useMessagesQuery,
  useReadAllMessagesMutation,
} from '@/requests/panel/messages';
import { useBreakpoint, useLang } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

const NotificationsMenuContent = () => {
  const [global, messages] = useLang(['global', 'messages']);

  const queryClient = useQueryClient();
  const { isDesktop } = useBreakpoint();

  const [notifications, setNotifications] = useState<Message[]>([]);

  const { data, isLoading } = useMessagesQuery();
  const { mutateAsync } = useReadAllMessagesMutation();

  const readAllMessages = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.log('e:', error);
    }
  };

  const updateBadge = useCallback(async () => {
    if (data?.result.notifications.length)
      setNotifications(data?.result.notifications);
    if (data?.result.unread_notifications_count) {
      await readAllMessages();
      queryClient.invalidateQueries({ queryKey: ['get-all-messages'] });
    }
  }, [data]);

  useEffect(() => {
    updateBadge();
  }, [updateBadge]);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-dark-50 py-4 px-4">
        <span className="text-base font-medium text-black">
          {messages.myMessages}
        </span>
        <Link
          href={
            isDesktop
              ? '/panel/my-account/messages/notification'
              : '/panel/my-account/messages/notification?modal=messages-content-modal'
          }
        >
          <Button size="sm" className="!rounded-[4px]">
            {global.all}
          </Button>
        </Link>
      </div>
      <div className="py-4 pr-4 pl-2">
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: '470px' }}>
            {notifications?.length ? (
              notifications?.map(({ date, message, title }, index) => (
                <>
                  <Link
                    href={
                      isDesktop
                        ? '/panel/my-account/messages/notification'
                        : '/panel/my-account/messages/notification?modal=messages-content-modal'
                    }
                    className="flex flex-col rounded-lg py-2 px-4 hover:bg-dark-50 ml-2"
                    id={`${date}-${index}`}
                  >
                    <span className="ml-auto mb-1 text-sm text-dark-700 font-medium">
                      {title}
                    </span>
                    <span className="ml-auto text-xs text-dark-500">
                      {message}
                    </span>
                  </Link>
                  {index !== notifications.length - 1 ? (
                    <hr className="border-b-[.25px] border-dark-50 mt-2" />
                  ) : (
                    <></>
                  )}
                </>
              ))
            ) : (
              <EmptyTable text={messages.noMessages} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsMenuContent;
