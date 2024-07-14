import React, { FC, useEffect } from 'react';
import Cookies from 'js-cookie';

import { Button, Icon, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { getLang, toPersianDigits } from '@/utils';
import { ShareIcon, SquarePlusIcon } from '@/components/Icons';
import usePwaGuide from '@/hooks/useIsPwa';

export const guideModalName = 'guide-modal';

//TODO: should replace with useLang when server lang update
const [global] = getLang(['global']);

const GuideModal: FC = () => {
  const { closeSyncModal, showSyncModal } = useModal(guideModalName);

  const { remind } = usePwaGuide();

  const STEPS = [
    <>
      {global.button} <span className="text-primary-600">{global.share}</span>
      ( <ShareIcon /> ) {global.selectFromBelowBar}
    </>,
    <>
      <span className="text-sm font-medium text-dark-600 inline-flex gap-1">
        {global.option}{' '}
        <span className="text-primary-600">{global.addToHomeScreen}</span>
        ( <SquarePlusIcon />) {global.selectIt}
      </span>
    </>,
    <>
      {global.fromTop}
      <span className="text-primary-600">{global.addIt}</span>
      {global.selectIt}
    </>,
  ];

  const handleClick = () => {
    Cookies.set('pwa_guide', 'true', { expires: 1 });
    closeSyncModal();
  };

  useEffect(() => {
    if (remind) {
      showSyncModal();
    }
  }, [remind]);

  return (
    <Modal
      sync
      name={guideModalName}
      onClose={closeSyncModal}
      maxWidth={382}
      hasCloseAction={false}
      disableCloseOnClickOutside
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div
            className={`rounded-[13px] bg-dark-50 flex items-center justify-center p-3`}
          >
            <Icon icon="Web-OutLined" size={24} color="#4E536B" />
          </div>
          <div className="flex gap-4 items-center justify-center">
            <h2 className="text-center font-bold text-dark-700">
              {global.pwa}
            </h2>
          </div>
          <hr className="w-full border-t border-dark-50 bg-dark-50" />
        </div>
      </div>
      <div className="pb-4 pt-2">
        <p className="text-sm font-normal text-dark-700 mb-6">
          {global.pwaGuideTitle}
        </p>
        <div className="flex flex-col">
          {STEPS.map((Item, idx) => {
            return (
              <div className="flex gap-2 mb-4">
                <div className="flex flex-col">
                  <div className="flex justify-center items-center w-6 h-6 rounded-full bg-primary-500">
                    <span className="text-sm font-medium text-white">
                      {toPersianDigits(idx + 1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-dark-600 inline-flex gap-1">
                    {Item}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ModalFooter>
        <Button size={'lg'} fullWidth onClick={handleClick} className="lg:mt-2">
          {global.gotIt}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GuideModal;
