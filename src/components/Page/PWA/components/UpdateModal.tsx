import React, { FC, useState } from 'react';

import { Button, Chip, Icon, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { getLang, toPersianDigits } from '@/utils';

import type { VersionType } from '..';

export const updateModalName = 'update-modal';

type Props = {
  version?: VersionType;
  redirect: () => void;
};

//TODO: should replace with useLang when server lang update
const [global] = getLang(['global']);

const UpdateModal: FC<Props> = ({ version, redirect }) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { closeSyncModal } = useModal(updateModalName);

  const handleButtonClick = () => {
    setIsUpdating(true);
    localStorage.setItem('app_version', version?.value!);
    setTimeout(() => {
      setIsUpdating(false);
      redirect();
    }, 3000);
  };

  return (
    <Modal
      sync
      name={updateModalName}
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
            className={`rounded-[13px] bg-primary-50 flex items-center justify-center p-3`}
          >
            <Icon icon="Convert-OutLined" size={24} color="#00CB8C" />
          </div>
          <div className="flex gap-4 items-center justify-center">
            <h2 className="text-center font-bold text-dark-700">
              {global.newUpdate}
            </h2>
            {version?.extra_data.force ? (
              <Chip variant="danger" label={global.force} />
            ) : (
              <></>
            )}
          </div>
          <hr className="w-full border-t border-dark-50 bg-dark-50" />
        </div>
      </div>
      <div className="py-4">
        <p className="text-sm font-normal text-dark-700 mb-6">
          {global.update} {toPersianDigits(version?.value)} {global.released}:
        </p>
        <div className="flex flex-col">
          {version?.extra_data.changelogs?.map((item) => (
            <div className="flex gap-2 mb-4">
              <div className="flex flex-col">
                <Icon icon="CheckCircle-Filled" size={24} color="#00DF9A" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-dark-600">
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalFooter>
        <div className="w-full flex gap-4 lg:mb-4 lg:mt-2">
          {!version?.extra_data.force ? (
            <Button
              size={'lg'}
              fullWidth
              onClick={redirect}
              className="flex flex-col"
              variant="secondary"
            >
              {global.remindUpdateLater}
            </Button>
          ) : (
            <></>
          )}
          <Button
            size={'lg'}
            fullWidth
            onClick={handleButtonClick}
            className="flex flex-col"
            isLoading={isUpdating}
          >
            {global.updatePWA}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateModal;
