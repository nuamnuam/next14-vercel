import React, { useState, useMemo, useRef, type ChangeEvent } from 'react';
import clsx from 'classnames';
import Link from 'next/link';

import { Button, CheckBox, Icon, InputAlert } from '@/components/Common';
import { useLang } from '@/hooks';
import { useUploadFaceImageMutation } from '@/requests/panel/my-account/kyc/uploadFaceImage';
import { base64ToBlob } from '@/utils/webcam';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';

const SelfiePreviewContent: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const [rules, setRules] = useState<boolean>(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const { picture, setPicture, setSelfieStep } = useUploadValidationProvider();

  const { isPending: isLoading, mutateAsync: mutateUploadFaceImageAsync } =
    useUploadFaceImageMutation();

  const pictureIsBlob = useMemo(() => {
    return picture instanceof Blob;
  }, [picture]);

  const isValidImageType = useMemo(() => {
    const validExtensions = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'];

    return (
      (picture as File).type.includes('image') &&
      validExtensions.includes((picture as File).name.split('.').pop() ?? '')
    );
  }, [picture]);

  const handleSubmit = async () => {
    const formData = new FormData();
    if (!picture) return;
    let file = picture;
    if (!pictureIsBlob) {
      file = base64ToBlob(picture as string);
    }

    formData.append('face_image', file as string);
    mutateUploadFaceImageAsync(formData).then(() => {
      setSelfieStep(SELFIE_STEPS.CONGRATS);
    });
  };

  const getImageSrc = () => {
    if (!picture) return '';
    if (pictureIsBlob) {
      const urlCreator = window.URL || window.webkitURL;
      return urlCreator.createObjectURL(picture as Blob);
    }
    return picture as string;
  };

  const tryAgain = () => {
    setSelfieStep(SELFIE_STEPS.ROOT);
  };

  const uploadNewPicture = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files?.[0]) return;
    setPicture(e.target?.files?.[0]);
  };

  return (
    <div className="">
      <div
        className={clsx(
          'hidden items-center justify-between border-b border-white md:flex md:border-dark-50 pb-[20px]',
        )}
      >
        <div className="hidden cursor-pointer items-center justify-start gap-x-2 md:flex">
          <p className="text-sm font-bold leading-6 text-gray-900">
            {kyc.uploadSelfie}
          </p>
        </div>
        <div
          className="hidden cursor-pointer items-center justify-end gap-x-2 md:flex"
          onClick={tryAgain}
        >
          <Icon
            icon={picture ? 'Reload-OutLined' : 'VideoCamera-OutLined'}
            className="[&>*]:fill-primary-500"
            size={16}
          />
          <p className="text-sm font-medium leading-6 text-primary-600">
            {kyc.selectAgain}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div
          className={clsx(
            'rounded-lg border border-dark-200 bg-dark-50 p-2 h-[212px] overflow-hidden',
            !isValidImageType && 'border-2 !border-danger-200',
          )}
        >
          {!!getImageSrc() && (
            <img
              src={getImageSrc() ?? ''}
              className="rounded-lg object-contain w-full h-full"
              alt="image"
            />
          )}
        </div>
        {!isValidImageType && (
          <InputAlert
            message={kyc.notValidImageType}
            variant="danger"
            className="mt-1"
          />
        )}
        <div className="my-6 flex items-start justify-start ">
          <CheckBox
            isChecked={rules}
            className="mt-1"
            handleInputChange={(status) => {
              setRules(status);
            }}
          />
          <p className="pr-2 text-sm font-normal leading-6 text-gray-900">
            {kyc.confirmAuthImage}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              className="px-1 text-primary-600"
            >
              {kyc.rulesOfArzinja}
            </Link>
            {kyc.readAndConfirm}
          </p>
        </div>
      </div>
      <input
        onChange={uploadNewPicture}
        ref={galleryInputRef}
        id="dropzone-file"
        type="file"
        className="hidden"
      />
      <ModalFooter fullScreen>
        <Button
          size="lg"
          fullWidth
          className="lg:mt-6"
          disabled={(!!picture && !rules) || !isValidImageType}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          {kyc.confirmAndSend}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default SelfiePreviewContent;
