import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { LangFileNames } from '@/language/langTypes';
import { getLang } from '@/utils';
import { useLangQuery } from '@/requests/language';

type MessagesType = Record<string, string>;

const useLang = (ids: LangFileNames[]): MessagesType[] => {
  const [messages, setMessages] = useState<MessagesType[]>(getLang(ids));

  const dataLoadedRef = useRef<boolean>(false);

  const intl = useIntl();

  //@ts-ignore
  const data = useLangQuery(ids, globalThis.LANGUAGE_BASE_URL, intl.locale);

  useEffect(() => {
    if (!data.some(({ isSuccess }) => isSuccess) || dataLoadedRef.current)
      return;

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];

      data.forEach(({ data }, idx) => {
        if (data && data.message !== 'Error') {
          updatedMessages[idx] = data;
        }
      });

      return updatedMessages;
    });

    dataLoadedRef.current = true;
  }, [data]);

  return messages;
};

export default useLang;
