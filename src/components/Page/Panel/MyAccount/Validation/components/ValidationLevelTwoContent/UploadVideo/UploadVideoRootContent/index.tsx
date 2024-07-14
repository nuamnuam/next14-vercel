import { Alert, Button, Icon } from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useModal } from '@/hooks/useModal';
import React, { useCallback, type Dispatch, type SetStateAction } from 'react';
import AccessVideoModal, { accessVideoModalName } from '../AccessVideoModal';
import {
  VIDEO_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import { useLang } from '@/hooks';

const UploadVideoRootContent: React.FC<{
  setPage?: Dispatch<SetStateAction<string>>;
}> = ({ setPage }) => {
  const [kyc] = useLang(['kyc']);

  const { showSyncModal: showAccessVideoModal } =
    useModal(accessVideoModalName);
  const { setVideoStep } = useUploadValidationProvider();

  const handleClick = useCallback(() => {
    navigator?.mediaDevices?.enumerateDevices().then((devices) =>
      devices.forEach((device) => {
        if (device.kind == 'videoinput') {
          if (device.label) {
            setVideoStep(VIDEO_STEPS.READY_LIVE);
          } else {
            showAccessVideoModal();
          }
        }
      }),
    );
  }, [setVideoStep, showAccessVideoModal]);

  return (
    <div>
      <div className="mb-6 pb-6 border-b border-dark-50 hidden items-center justify-between md:flex">
        <div
          className="flex cursor-pointer items-center justify-start gap-x-2"
          onClick={() => setPage?.('select-type')}
        >
          <p className="text-sm font-bold leading-6 text-dark-900">
            {kyc.confirmVideoAuthority}
          </p>
        </div>
        <button
          className="flex items-center justify-end gap-x-2"
          onClick={() => {
            setPage?.('select-type');
          }}
        >
          <Icon
            icon={'Camera-OutLined'}
            className="[&>*]:fill-primary-600"
            size={18}
          />
          <p className="cursor-pointer text-sm font-medium leading-6 text-primary-600">
            {kyc.changeWay}
          </p>
        </button>
      </div>
      <p className="text-sm mb-6 font-medium leading-6 text-dark-800">
        {kyc.noticeBeforeVideoRecord}
      </p>
      <div>
        <Alert
          slug={{
            feature: 'user-verification',
            section: 'identity-doc-upload-face-video',
            step: 'upload-face-video',
          }}
        />
        <AccessVideoModal />
        <ModalFooter fullScreen>
          <Button
            size="lg"
            fullWidth
            className="lg:mt-6"
            onClick={() => handleClick()}
          >
            {kyc.iamReady}
          </Button>
        </ModalFooter>
      </div>
    </div>
  );
};

export default UploadVideoRootContent;
