import React, { type Dispatch, type SetStateAction, useMemo } from 'react';
import LevelTwoCongrats from '../LevelTwoCongrats';
import UploadVideoRootContent from './UploadVideoRootContent';
import UploadVideoReadyLiveContent from './UploadVideoReadyLiveContent';
import UploadVideoPreviewContent from './UploadVideoPreviewContent';
import {
  VIDEO_STEPS,
  useUploadValidationProvider,
} from '../UploadValidationProvider';

interface Props {
  setPage?: Dispatch<SetStateAction<string>>;
}

const UploadVideoContent: React.FC<Props> = ({ setPage }) => {
  const { videoStep } = useUploadValidationProvider();
  const renderContent = useMemo(() => {
    return {
      [VIDEO_STEPS.ROOT]: <UploadVideoRootContent setPage={setPage} />,
      [VIDEO_STEPS.READY_LIVE]: (
        <UploadVideoReadyLiveContent setPage={setPage} />
      ),
      [VIDEO_STEPS.PREVIEW]: <UploadVideoPreviewContent setPage={setPage} />,
      [VIDEO_STEPS.CONGRATS]: <LevelTwoCongrats />,
    }[videoStep];
  }, [videoStep]);

  return <>{renderContent}</>;
};

export default UploadVideoContent;
