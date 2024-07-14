import React, {
  type ComponentType,
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { type Blob } from 'buffer';
import SampleSelfieModal from './UploadSelfie/SampleSelfieModal';
import AccessCameraModal from './UploadSelfie/AccessCameraModal';
import UploadSelfieModal from './UploadSelfie/UploadSelfieModal';
import UploadVideoModal from './UploadVideo/UploadVideoModal';

export const SELFIE_STEPS = {
  ROOT: 'root',
  LIVE: 'live',
  PREVIEW: 'preview',
  CONGRATS: 'congrats',
};

export const VIDEO_STEPS = {
  ROOT: 'root',
  READY_LIVE: 'ready_live',
  PREVIEW: 'preview',
  CONGRATS: 'congrats',
};

type ValueOf<T> = T[keyof T];

type SelfieStep = ValueOf<typeof SELFIE_STEPS>;
type VideoStep = ValueOf<typeof VIDEO_STEPS>;

type ContextType = {
  selfieStep: SelfieStep;
  picture: string | Blob | null | undefined;
  videoStep: VideoStep;
  video: Blob[] | undefined;
  capturing: boolean;
  setSelfieStep: Dispatch<SetStateAction<SelfieStep>>;
  setPicture: Dispatch<SetStateAction<string | Blob | null | undefined>>;
  setVideoStep: Dispatch<SetStateAction<VideoStep>>;
  setVideo: Dispatch<SetStateAction<Blob[] | undefined>>;
  setCapturing: Dispatch<SetStateAction<boolean>>;
};

const contextTypeDefaultValues = {
  selfieStep: SELFIE_STEPS.ROOT,
  picture: null,
  selfieSource: null,
  videoStep: VIDEO_STEPS.ROOT,
  video: undefined,
  capturing: false,
  setSelfieStep: () => {},
  setPicture: () => {},
  setSelfieSource: () => {},
  setVideoStep: () => {},
  setVideo: () => {},
  setCapturing: () => {},
};

const UploadValidationContext = createContext<ContextType>(
  contextTypeDefaultValues,
);

const UploadValidationProviderWrapper = <T extends {}>(
  Container: ComponentType<T>,
) => {
  return (props: T) => (
    <UploadValidationProvider>
      <Container {...props} />
    </UploadValidationProvider>
  );
};

export const UploadValidationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selfieStep, setSelfieStep] = useState<SelfieStep>(SELFIE_STEPS.ROOT);
  const [picture, setPicture] = useState<string | Blob | null | undefined>();
  const [videoStep, setVideoStep] = useState<VideoStep>(VIDEO_STEPS.ROOT);
  const [video, setVideo] = useState<Blob[] | undefined>(undefined);
  const [capturing, setCapturing] = useState<boolean>(false);

  return (
    <UploadValidationContext.Provider
      value={{
        selfieStep,
        picture,
        videoStep,
        video,
        capturing,
        setSelfieStep,
        setPicture,
        setVideoStep,
        setVideo,
        setCapturing,
      }}
    >
      {children}
      <UploadSelfieModal />
      <UploadVideoModal />
      <SampleSelfieModal />
      <AccessCameraModal />
    </UploadValidationContext.Provider>
  );
};

export const useUploadValidationProvider = () => {
  const {
    selfieStep,
    picture,
    videoStep,
    video,
    capturing,
    setSelfieStep,
    setPicture,
    setVideoStep,
    setVideo,
    setCapturing,
  } = useContext(UploadValidationContext) || {};

  return {
    selfieStep,
    picture,
    videoStep,
    video,
    capturing,
    setSelfieStep,
    setPicture,
    setVideoStep,
    setVideo,
    setCapturing,
  };
};

export default UploadValidationProviderWrapper;
