import React from 'react';

import { Image, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import ImagePlaceHolder from '@/assets/images/kyc/AuthBanner.jpg';
import { useLang } from '@/hooks';

export const sampleSelfieModalName = 'sample-selfie-modal';
const SampleSelfieModal = () => {
  const [kyc] = useLang(['kyc']);

  const { closeModal } = useModal(sampleSelfieModalName);
  return (
    <Modal
      name={sampleSelfieModalName}
      onClose={closeModal}
      title={kyc.sampleSelfie}
      headerIcon="Camera-TwoTone"
      contentAddtionalClassNames="!px-8 lg:!px-10"
      headerClassNames="!px-8 lg:!px-10"
    >
      <div className="flex items-center justify-center [&_span]:!w-full [&_span]:!block">
        <Image
          src={ImagePlaceHolder}
          className="object-cover rounded-lg"
          alt="image"
        />
      </div>
    </Modal>
  );
};

export default SampleSelfieModal;
