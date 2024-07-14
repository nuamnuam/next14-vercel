import React from 'react';
import { Button, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { uploadSelfieSelectModalName } from '../UploadSelfieSelectModal';
import {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import Link from 'next/link';
import { useLang } from '@/hooks';

export const accessCameraModalName = 'access-camera-modal';

const AccessCameraModal: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const { setSelfieStep } = useUploadValidationProvider();

  const { closeSyncModal: closeAccessCameraModal } = useModal(
    accessCameraModalName,
  );
  const { closeModal: closeUploadSelfieSelectModal } = useModal(
    uploadSelfieSelectModalName,
  );

  const handleActivateClick = () => {
    closeAccessCameraModal();
    closeUploadSelfieSelectModal();
    setSelfieStep(SELFIE_STEPS.LIVE);
  };

  return (
    <Modal
      sync
      name={accessCameraModalName}
      onClose={closeAccessCameraModal}
      title={kyc.cameraAccess}
      headerIcon="Camera-TwoTone"
      contentAddtionalClassNames="!px-8 lg:!px-10"
      headerClassNames="!px-8 lg:!px-10"
      footer={
        <div className="flex gap-x-4">
          <Button
            size="lg"
            className="w-full border-none bg-dark-500 hover:bg-dark-500"
          >
            <Link href="/help">{kyc.needHelp}</Link>
          </Button>
          <Button size="lg" className="w-full" onClick={handleActivateClick}>
            {kyc.activate}
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-center">
        <p className="font-medium leading-6 text-dark-700">
          {kyc.activeDeviceAccess}
        </p>
      </div>
    </Modal>
  );
};

export default AccessCameraModal;
