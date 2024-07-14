import React, { PropsWithChildren, useEffect, useRef } from 'react';

import { useModal } from '@/hooks/useModal';
import { useBreakpoint } from '@/hooks';

import MessagesContent from './components/MessagesContent';
import MessagesContentModal, {
  messagesContentModalName,
} from './components/MessagesContentModal';

const MessagesPage = ({ children }: PropsWithChildren) => {
  const initRef = useRef(true);
  const { showModal } = useModal(messagesContentModalName, true);
  const { isDesktop, isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    if (initRef.current) {
      initRef.current = false;
      return;
    }
    if (isDesktop) return;
    showModal();
  }, [isDesktop, isMobile, isTablet]);

  if (!isDesktop)
    return <MessagesContentModal>{children}</MessagesContentModal>;
  return <MessagesContent>{children}</MessagesContent>;
};

export default MessagesPage;
