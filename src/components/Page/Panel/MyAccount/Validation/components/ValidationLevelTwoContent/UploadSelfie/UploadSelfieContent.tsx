import React, { type Dispatch, type SetStateAction, useMemo } from 'react';
import UploadSelfieRootContent from './UploadSelfieRootContent';
import SelfieLiveContent from './SelfieLiveContent';
import SelfiePreviewContent from './SelfiePreviewContent';
import LevelTwoCongrats from '../LevelTwoCongrats';
import {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from '../UploadValidationProvider';

interface Props {
  setPage?: Dispatch<SetStateAction<string>>;
}

const UploadSelfieContent: React.FC<Props> = ({ setPage }) => {
  const { selfieStep } = useUploadValidationProvider();

  const renderContent = useMemo(() => {
    return {
      [SELFIE_STEPS.ROOT]: <UploadSelfieRootContent setPage={setPage} />,
      [SELFIE_STEPS.LIVE]: <SelfieLiveContent setPage={setPage} />,
      [SELFIE_STEPS.PREVIEW]: <SelfiePreviewContent />,
      [SELFIE_STEPS.CONGRATS]: <LevelTwoCongrats />,
    }[selfieStep];
  }, [selfieStep]);

  return <>{renderContent}</>;
};

export default UploadSelfieContent;
