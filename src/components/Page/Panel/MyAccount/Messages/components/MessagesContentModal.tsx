import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { Modal } from '@/components/Common';
import { useLang } from '@/hooks';

import MessagesContent from './MessagesContent';

export const messagesContentModalName = 'messages-content-modal';

const MessagesContentModal = ({ children }: PropsWithChildren) => {
  const [messages] = useLang(['messages']);

  const router = useRouter();

  return (
    <Modal
      name={messagesContentModalName}
      noTransition
      onClose={() => router.push('/panel/dashboard')}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-4 !pt-4 lg:!px-0 g:!pt-0"
      headerClassNames="!px-4 sm:!px-8 !py-4"
      fullScreen
      title={messages.messages}
    >
      <div>
        <MessagesContent>{children}</MessagesContent>
      </div>
    </Modal>
  );
};

export default MessagesContentModal;
