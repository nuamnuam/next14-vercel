import React, { useEffect, useState } from 'react';

import { Button, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useLang, useNavigatorOnline } from '@/hooks';
import { useConnectionQuery } from '@/requests/connectivity';

import ModalFooter from '../Common/Modal/ModalFooter';
import { DisconnectIcon } from '../Icons';

export const networkStatusHModalName = 'network-status-modal';

const NetworkStatusModal = () => {
  const [global] = useLang(['global']);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isDesktop } = useBreakpoint();

  const isOnline = useNavigatorOnline();
  const { refetch } = useConnectionQuery(!isOnline, isOnline ? 10000 : 1000);

  const { closeSyncModal, showSyncModal } = useModal(networkStatusHModalName);

  useEffect(() => {
    if (!isOnline) return showSyncModal();
    return closeSyncModal();
  }, [isOnline]);

  const handleButtonClick = async () => {
    setIsLoading(true);
    await refetch();
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <Modal
      sync
      name={networkStatusHModalName}
      onClose={closeSyncModal}
      contentAddtionalClassNames="!pt-0"
      titleWrapperClassName="!pt-10"
      maxWidth={382}
      hasCloseAction={false}
      disableCloseOnClickOutside
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div
            className={`rounded-[13px] bg-danger-50 flex items-center justify-center p-4`}
          >
            <DisconnectIcon />
          </div>
          <h2 className="text-center font-bold text-dark-700">
            {global.internetConnection}
          </h2>
          <hr className="w-full border-t border-dark-50 bg-dark-50" />
        </div>
      </div>
      <div>
        <p className="text-sm font-normal text-dark-700">
          {global.accessToInternet}
        </p>
        <p className="text-sm font-normal text-dark-700 my-8">
          {global.internetSetting}
        </p>
      </div>
      <ModalFooter>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          fullWidth
          onClick={handleButtonClick}
          className="lg:mt-1"
          isLoading={isLoading}
        >
          {global.retry}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NetworkStatusModal;
