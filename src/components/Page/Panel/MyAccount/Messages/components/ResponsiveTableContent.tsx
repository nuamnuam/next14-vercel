import { useEffect, useRef } from 'react';

import { Paper, Spinner, BoxDivider, EmptyTable } from '@/components/Common';
import {
  MessageType,
  useInfiniteMessagesQuery,
} from '@/requests/panel/messages/getAllMessages';
import { useIntersectionObserver, useLang } from '@/hooks';

import { TableRow } from './index';

interface IProps {
  selectedTab?: MessageType;
}

const ResponsiveTableContent: React.FC<IProps> = ({
  selectedTab = 'notification',
}: IProps) => {
  const [messages] = useLang(['messages']);

  const elementRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteMessagesQuery(selectedTab);

  useIntersectionObserver(elementRef, () => {
    if (hasNextPage) fetchNextPage();
  });

  useEffect(() => {
    refetch();
  }, [selectedTab]);

  return (
    <Paper classNames="p-0 flex-col flex items-center rounded-t-none">
      <BoxDivider className="w-full" />
      <table className="w-full table-auto">
        <tbody className="[&>div:not(:last-child)]:border-b border-dark-50">
          {data?.pages?.[0]?.result?.notifications?.length ? (
            data?.pages.map(
              (page) =>
                page?.result?.notifications?.map(
                  ({ date, title, message, is_pin, url }, index) => (
                    <TableRow
                      key={index}
                      tr={{
                        date,
                        title: title || '',
                        description: message,
                        has_icon: is_pin,
                        url,
                      }}
                    />
                  ),
                ),
            )
          ) : isLoading ? (
            <div className="w-full justify-center flex my-2">
              <Spinner />
            </div>
          ) : (
            <EmptyTable text={messages.noMessages} />
          )}
        </tbody>
      </table>
      <div className="w-full justify-center flex my-2" ref={elementRef}>
        {isFetchingNextPage ? <Spinner /> : null}
      </div>
    </Paper>
  );
};

export default ResponsiveTableContent;
