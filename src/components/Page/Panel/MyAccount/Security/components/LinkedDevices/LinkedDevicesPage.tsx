import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useSecurityStore } from '@/store';
import { Icon, Button, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { type IActivity } from '@/types/myAccount';
import { useActivityLoginsQuery } from '@/requests/panel/my-account/security/getActivitiesLogins';
import { useTerminateDeviceMutation } from '@/requests/panel/my-account/security/terminateDevice';
import { useBreakpoint, useLang } from '@/hooks';
import { formatedDate } from '@/utils/date-format';

import DevicesTable from './DevicesTable';

const modalName = 'linkedDevicesPage';

interface IProps {
  className?: string;
  faType?: string;
  noHeader?: boolean;
  selectedDeleteDevice?: IActivity | null;
  setselectedDeleteDevice?: any;
}

const LinkedDevicesPage = (props: IProps) => {
  const [global, security] = useLang(['global', 'security']);

  const queryClient = useQueryClient();

  const { selectedDeleteDevice, setselectedDeleteDevice } = useSecurityStore(
    (state) => ({
      selectedDeleteDevice: state.selectedDeleteDevice,
      setselectedDeleteDevice: state.setselectedDeleteDevice,
    }),
  );

  const { showSyncModal, closeSyncModal, isSyncModalOpen } =
    useModal(modalName);
  const { isDesktop } = useBreakpoint();

  const { data: devices, isLoading: devicesLoading } = useActivityLoginsQuery();

  const { mutateAsync: asyncTerminateDeviceAsync, isPending: isLoading } =
    useTerminateDeviceMutation();

  const handleDeleteItem = () => {
    showSyncModal();
  };
  const handleDeleteDevice = async () => {
    const { success } = await asyncTerminateDeviceAsync(
      selectedDeleteDevice?.id ?? '',
    );
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['get-active-devices'] });
      closeSyncModal();
      setselectedDeleteDevice(null);
    } else {
    }
  };
  const handleCloseModal = () => {
    closeSyncModal();
    setselectedDeleteDevice(null);
  };

  return (
    <>
      {isSyncModalOpen && (
        <Modal
          sync
          name={modalName}
          onClose={handleCloseModal}
          title={security.deleteDetails}
          headerIcon="PasswordCheck-TwoTone"
          titleWrapperClassName="!px-8 md:px-6"
        >
          {!isDesktop ? (
            <div className="px-4 md:px-0">
              <div className="flex w-full items-center justify-end pb-6">
                <p className="text-left font-normal text-dark-600">
                  {selectedDeleteDevice?.agent}
                </p>
                <Icon
                  icon={
                    selectedDeleteDevice?.device === 'Desktop'
                      ? 'Desktop-OutLined'
                      : 'Mobile-OutLined'
                  }
                  className="mr-4"
                  size={17}
                />
              </div>
              <div className="flex w-full items-center justify-between pb-6 text-dark-500 text-sm">
                <p>{security.lastConnectedTime}</p>
                <p>
                  {formatedDate({
                    date: selectedDeleteDevice?.created_at,
                    locale: 'fa',
                  })}
                </p>
              </div>
              <div className="flex w-full items-center justify-between pb-6 text-dark-500 text-sm">
                <p>{global.ip}</p>
                <p>{selectedDeleteDevice?.ip}</p>
              </div>
            </div>
          ) : (
            <p className="mb-6 text-right text-base font-medium text-dark-700 px-3">
              {security.areYouSureToDeleteDevice}
            </p>
          )}

          <div className="flex w-full gap-x-4 md:px-3">
            <Button
              variant="dark"
              fullWidth
              className="w-[183px] h-12 border-none bg-dark-500"
              onClick={handleCloseModal}
              size="md"
            >
              {global.cancel}
            </Button>
            <Button
              variant="dark"
              fullWidth
              className="w-[183px] h-12 border-none bg-danger-500"
              onClick={handleDeleteDevice}
              size="md"
              isLoading={isLoading}
            >
              {global.delete}
            </Button>
          </div>
        </Modal>
      )}
      <DevicesTable
        deleteItem={(device) => {
          setselectedDeleteDevice(device);
          handleDeleteItem();
        }}
        isLoading={devicesLoading}
        data={devices?.result?.filter((device) => device?.status) ?? []}
      />
    </>
  );
};

export default LinkedDevicesPage;
