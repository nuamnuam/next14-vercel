import React, {
  type Dispatch,
  type SetStateAction,
  useState,
  useMemo,
} from 'react';
import Link from 'next/link';

import { Button, CheckBox, Icon, VideoPlayer } from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useUploadFaceVideoMutation } from '@/requests/panel/my-account/kyc/uploadFaceVideo';
import {
  VIDEO_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import { useLang } from '@/hooks';

const UploadVideoPreviewContent: React.FC<{
  setPage?: Dispatch<SetStateAction<string>>;
}> = () => {
  const [kyc] = useLang(['kyc']);

  const { video, setVideoStep } = useUploadValidationProvider();
  const [rules, setRules] = useState<boolean>(false);

  const { isPending: isLoading, mutateAsync: mutateUploadFaceVideoAsync } =
    useUploadFaceVideoMutation();

  const renderSrc = useMemo(() => {
    if (!video?.length) return '';
    return URL.createObjectURL(video[0] as Blob);
  }, [video]);

  const onSubmitHandler = async () => {
    const formData = new FormData();
    formData.append(
      'face_video',
      new File([video?.[0] as Blob], 'filename.mp4', { type: 'video/mp4' }),
    );

    const { success } = await mutateUploadFaceVideoAsync(formData);
    if (success) {
      setVideoStep(VIDEO_STEPS.CONGRATS);
    }
  };

  return (
    <div className="">
      <div className="mb-6 pb-6 md:flex items-center justify-between border-b border-dark-50 hidden">
        <div className="flex cursor-pointer items-center justify-start gap-x-2">
          <p className="text-sm font-bold leading-6 text-gray-900">
            {kyc.recordVideo}
          </p>
        </div>

        <div
          className="flex cursor-pointer items-center justify-end gap-x-2"
          onClick={() => setVideoStep(VIDEO_STEPS.READY_LIVE)}
        >
          <Icon
            icon="Reload-OutLined"
            className="[&>*]:fill-danger-500"
            size={18}
          />
          <p className="text-sm font-medium leading-6 text-danger-500">
            {kyc.recordAgain}
          </p>
        </div>
      </div>
      <div className="[&>video:rounded-full]">
        <VideoPlayer src={renderSrc} />
        <>
          <div className="my-6 flex items-start justify-start ">
            <div className="mt-0.5">
              <CheckBox
                isChecked={rules}
                handleInputChange={(status) => {
                  setRules(status);
                }}
              />
            </div>
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
        </>
        <ModalFooter fullScreen>
          <Button
            size="lg"
            className="md:mt-6"
            fullWidth
            disabled={!(video?.length === 0) && !rules}
            isLoading={isLoading}
            onClick={onSubmitHandler}
          >
            {kyc.confirmAndSend}
          </Button>
        </ModalFooter>
      </div>
    </div>
  );
};

export default UploadVideoPreviewContent;
