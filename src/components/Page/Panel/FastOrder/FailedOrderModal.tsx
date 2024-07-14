import React from 'react';

import { Modal, Icon, Button } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang } from '@/hooks';

export const failedOrderModalName = 'failed-order-modal';

const FaildOrderModal: React.FC = () => {
  const [instantTrade] = useLang(['instantTrade']);

  const { isDesktop } = useBreakpoint();
  const { closeSyncModal } = useModal(failedOrderModalName);

  return (
    <Modal
      sync
      name={failedOrderModalName}
      onClose={closeSyncModal}
      contentAddtionalClassNames="!pt-0 -mt-5"
      titleWrapperClassName="!pt-9"
      maxWidth={382}
      hasCloseAction
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="rounded-[13px] bg-danger-50 flex items-center justify-center p-2">
            <Icon
              icon="InfoCircle-OutLined"
              size={24}
              className="[&>*]:fill-danger-500"
            />
          </div>
          <h2 className="text-center font-bold text-dark-700">
            {instantTrade.errorInSubmitOrder}
          </h2>
          <hr className="h-1 bg-gray-50 w-full border border-gray-50 mb-6" />
          <h2 className="text-center text-dark-700">
            {instantTrade.errorOccured}
          </h2>
          <h2 className="text-center text-dark-700 mb-6">
            {instantTrade.trayLater}
          </h2>
        </div>
      </div>
      <ModalFooter>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          fullWidth
          onClick={() => closeSyncModal()}
          className="lg:mt-1"
        >
          {instantTrade.confirm}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FaildOrderModal;
