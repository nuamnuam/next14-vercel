import React from 'react';
import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useSecurityStore } from '@/store';
import { formatedDate } from '@/utils/date-format';
import { useLang } from '@/hooks';

const modalName = 'activityHistoryPage';

interface IProps {
  className?: string;
  faType?: string;
  noHeader?: boolean;
  title: string;
}

const ActivityHistoryModal = ({ title }: IProps) => {
  const [global, security] = useLang(['global', 'security']);

  const { selectedActivity, setselectedDevice } = useSecurityStore();
  const { closeSyncModal } = useModal(modalName);

  return (
    <>
      <Modal
        sync
        name={modalName}
        onClose={() => {
          closeSyncModal();
          setselectedDevice(null);
        }}
        title={title}
        headerIcon="PasswordCheck-TwoTone"
        titleWrapperClassName="!px-8 md:px-6"
      >
        <div className="px-4">
          {selectedActivity?.action_type_text && (
            <>
              <div className="flex w-full items-center justify-between pb-6">
                <p>{security.actionType}</p>
                <p>{selectedActivity?.action_type_text}</p>
              </div>
            </>
          )}
          <div className="flex w-full items-center justify-between pb-6 text-sm text-dark-500">
            <p>{global.date}</p>
            <p>
              {formatedDate({
                date: selectedActivity?.created_at,
                locale: 'fa',
              })}
            </p>
          </div>
          {selectedActivity?.agent ? (
            <div className=" flex w-full  items-center justify-between pb-6 text-sm text-dark-500">
              <p>{security.device}</p>
              <p className="two-line-truncate max-w-[200px] text-left">
                {selectedActivity?.agent}
              </p>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between pb-6 text-sm text-dark-500">
              <p>{security.device}</p>
              <p>{selectedActivity?.device}</p>
            </div>
          )}

          <div className="flex w-full items-center justify-between text-sm text-dark-500">
            <p>{global.ip}</p>
            <p>{selectedActivity?.ip}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ActivityHistoryModal;
