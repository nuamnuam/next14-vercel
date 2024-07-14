import { useEffect, useState } from 'react';

import {
  Paper,
  Spinner,
  Pagination,
  BoxDivider,
  EmptyTable,
} from '@/components';
import {
  MessageType,
  useMessagesQuery,
} from '@/requests/panel/messages/getAllMessages';
import { useLang } from '@/hooks';

import { TableRow } from './index';

interface IProps {
  selectedTab?: MessageType;
}

const TableContent: React.FC<IProps> = ({
  selectedTab = 'notification',
}: IProps) => {
  const [messages] = useLang(['messages']);

  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useMessagesQuery(page, selectedTab);

  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  return (
    <Paper classNames="p-0 flex-col flex items-center rounded-t-none">
      {isLoading ? (
        <div className="flex justify-center my-2">
          <Spinner />
        </div>
      ) : (
        <>
          <BoxDivider className="w-full bg-dark-50" />
          <table className="w-full table-auto">
            <tbody className="w-full [&>div]:border-b border-dark-50">
              {data?.result.notifications.length ? (
                data?.result.notifications?.map(
                  ({ date, title, message, url, is_pin }, index) => (
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
                )
              ) : (
                <EmptyTable text={messages.noMessages} />
              )}
            </tbody>
          </table>
          {data?.result.notifications &&
          data?.result.notifications.length > 9 ? (
            <div className="my-5 mx-auto flex w-full items-center justify-center">
              <Pagination
                count={data?.pagination.total_pages || 1}
                page={data?.pagination.current_page || 1}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </Paper>
  );
};

export default TableContent;
