import { useState, useCallback, useEffect } from 'react';
import clsx from 'classnames';

import { Icon, Button } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';
import { useBreakpoint, useProfile, useLang } from '@/hooks';

import { uploadSelfieModalName } from './UploadSelfie/UploadSelfieModal';
import UploadSelfieContent from './UploadSelfie/UploadSelfieContent';
import UploadSelfieSelectModal from './UploadSelfie/UploadSelfieSelectModal';
import UploadVideoContent from './UploadVideo/UploadVideoContent';
import { uploadVideoModalName } from './UploadVideo/UploadVideoModal';

import CustomToolTip from './CustomToolTip';
import { useRouter } from 'next/router';
import ModalFooter from '@/components/Common/Modal/ModalFooter';

const uploadSelfieSelectModal = 'uploadSelfieSelectModal';
const accessCameraModal = 'accessCameraModal';

const ConfirmAuthority: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const [imageStatus, videoStatus] = useSettingValue([
    SETTINGS.KYC_FACE_IMAGE,
    SETTINGS.KYC_FACE_VIDEO,
  ]) as string[];

  const KYC_FACE_IMAGE_ENABLED = imageStatus === '1';
  const KYC_FACE_VIDEO_ENABLED = videoStatus === '1';

  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const { data: userInfo } = useProfile();
  const [page, setPage] = useState('select-type');

  const { showModal: showUploadSelfieSelectModal } = useModal(
    uploadSelfieSelectModal,
  );
  const { showModal: showUploadVideoModal } = useModal(uploadVideoModalName);
  const { showModal: showAccessCameraModal } = useModal(accessCameraModal);
  const { showModal: showUploadSelfieModal } = useModal(uploadSelfieModalName);

  useEffect(() => {
    if (!userInfo) return;
    if (
      [userInfo.status.face_image, userInfo.status.face_video].includes(
        'Accepted',
      ) ||
      [userInfo.status.face_image, userInfo.status.face_video].includes(
        'Edited',
      )
    ) {
      router.replace('/panel/my-account/validation');
    }
  }, [userInfo]);

  const getContent = useCallback(() => {
    switch (page) {
      case 'select-type':
        return (
          <div>
            <p className="mb-6 text-sm font-medium leading-6 text-dark-900">
              {kyc.selectAuthorityWay}
            </p>
            <div className="flex w-full gap-x-6">
              <CustomToolTip
                title={
                  !KYC_FACE_IMAGE_ENABLED ? (
                    <span className="text-sm font-normal text-white text-center">
                      {kyc.disabledSelfieUpload}
                    </span>
                  ) : null
                }
              >
                <div className="flex-1">
                  <div
                    className={clsx(
                      'flex mb-6 cursor-pointer flex-col items-center justify-center rounded-md border border-dark-100 py-8',
                      !KYC_FACE_IMAGE_ENABLED && 'opacity-30 ',
                    )}
                    onClick={() => {
                      if (KYC_FACE_IMAGE_ENABLED) {
                        isDesktop
                          ? setPage('upload-selfie')
                          : showUploadSelfieModal();
                      }
                    }}
                  >
                    <Icon
                      icon={'Camera-OutLined'}
                      className="[&>*]:fill-primary-500"
                      size={24}
                    />
                    <p className="mt-4 text-sm font-medium leading-6 text-dark-900">
                      {kyc.selfieImage}
                    </p>
                  </div>
                  <p className="text-xs leading-5 text-dark-600">
                    {kyc.uploadSelfieRules}
                  </p>
                </div>
              </CustomToolTip>
              <CustomToolTip
                title={
                  !KYC_FACE_VIDEO_ENABLED ? (
                    <span className="text-sm font-normal text-white text-center">
                      {kyc.disabledRecordVideo}
                    </span>
                  ) : null
                }
              >
                <div className="flex-1">
                  <div
                    className={clsx(
                      'flex mb-6 cursor-pointer flex-col items-center justify-center rounded-md border border-dark-100 py-8',
                      !KYC_FACE_VIDEO_ENABLED && 'opacity-30 ',
                    )}
                    onClick={() => {
                      if (KYC_FACE_VIDEO_ENABLED) {
                        isDesktop
                          ? setPage('upload-video')
                          : showUploadVideoModal();
                      }
                    }}
                  >
                    <Icon
                      icon={'VideoCamera-OutLined'}
                      className="[&>*]:fill-primary-500"
                      size={24}
                    />
                    <p className="mt-4 text-sm font-medium leading-6 text-dark-900">
                      {kyc.recordVideo}
                    </p>
                  </div>
                  <p className="text-xs leading-5 text-dark-600">
                    {kyc.recordVideoWithRules}
                  </p>
                </div>
              </CustomToolTip>
            </div>
          </div>
        );
      case 'upload-selfie':
        return <UploadSelfieContent setPage={setPage} />;
      case 'upload-video':
        return <UploadVideoContent setPage={setPage} />;
      default:
        return null;
    }
  }, [page, isDesktop, showUploadSelfieModal, setPage]);

  return (
    <div>
      {getContent()}
      {page !== 'select-type' && (
        <ModalFooter fullScreen className="md:hidden">
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              if (page === 'upload-selfie') {
                showUploadSelfieSelectModal();
              } else if (page === 'upload-video') {
                showAccessCameraModal();
              }
            }}
          >
            {page === 'upload-selfie'
              ? kyc.addImage
              : page === 'upload-video'
              ? kyc.iamReady
              : kyc.nextStep}
          </Button>
        </ModalFooter>
      )}
      <UploadSelfieSelectModal />
    </div>
  );
};

export default ConfirmAuthority;
