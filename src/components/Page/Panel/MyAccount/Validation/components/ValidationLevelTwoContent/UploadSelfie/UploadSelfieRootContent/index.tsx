import { Alert, Button, Card, Icon } from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useLang, useProfile } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import moment from 'jalali-moment';
import React, { type Dispatch, type SetStateAction } from 'react';
import { sampleSelfieModalName } from '../SampleSelfieModal';
import { uploadSelfieSelectModalName } from '../UploadSelfieSelectModal';
import { toPersianDigits } from '@/utils';

const UploadSelfieRootContent: React.FC<{
  setPage?: Dispatch<SetStateAction<string>>;
}> = ({ setPage }) => {
  const [kyc] = useLang(['kyc']);

  const { data: userInfo } = useProfile();
  const { showModal: showSampleSelfieModal } = useModal(sampleSelfieModalName);
  const { showModal: showUploadSelfieSelectModal } = useModal(
    uploadSelfieSelectModalName,
  );
  return (
    <div>
      <div className="hidden lg:block">
        <div className="mb-[18px] flex items-center justify-between">
          <div className="flex cursor-pointer items-center justify-start gap-x-2">
            <p className="text-sm font-bold leading-6 text-dark-900">
              {kyc.uploadSelfie}
            </p>
          </div>
          <button
            className="flex items-center justify-end gap-x-2"
            onClick={() => setPage?.('select-type')}
          >
            <Icon
              icon={'VideoCamera-OutLined'}
              className="[&>*]:fill-primary-600"
              size={18}
            />
            <p className="cursor-pointer text-sm font-medium leading-6 text-primary-600">
              {kyc.changeWay}
            </p>
          </button>
        </div>
        <div className="w-full border-b border-dark-50 mb-6" />
      </div>
      <div>
        <Alert
          slug={{
            feature: 'user-verification',
            section: 'identity-doc-upload-face-image',
            step: 'upload-face-image',
          }}
        />
        <div className="mb-6 flex items-center justify-between lg:gap-10">
          <p className="text-sm font-medium leading-6 text-dark-800">
            {kyc.writeAConfirmText}
          </p>
          <div
            className="hidden cursor-pointer items-center justify-end gap-x-2 lg:flex"
            onClick={() => showSampleSelfieModal()}
          >
            <Icon
              icon={'AddPicture-OutLined'}
              className="[&>*]:fill-warning-600"
              size={18}
            />
            <p className="text-sm font-medium leading-6 text-warning-600 whitespace-pre">
              {kyc.sampleSelfie}
            </p>
          </div>
        </div>
        <Card classNames="!bg-dark-50 p-6 border border-dark-200 lg:mb-6">
          <div>
            <p className="text-sm mb-6 font-medium text-dark-700 leading-6">
              {kyc.me}{' '}
              {(userInfo?.first_name ?? '') + ' ' + (userInfo?.last_name ?? '')}{' '}
              {kyc.withNationalCode}{' '}
              {toPersianDigits(userInfo?.national_code ?? '-')} {kyc.inDate}{' '}
              {toPersianDigits(moment().locale('fa').format('YYYY/M/D'))}
              {kyc.sampleConfirmText}
            </p>
            <p className="text-sm font-medium text-dark-700 leading-6">
              {kyc.sampleConfirmTextFooter}
            </p>
          </div>
        </Card>
        <ModalFooter fullScreen>
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              showUploadSelfieSelectModal();
            }}
          >
            {kyc.addImage}
          </Button>
        </ModalFooter>
      </div>
    </div>
  );
};

export default UploadSelfieRootContent;
