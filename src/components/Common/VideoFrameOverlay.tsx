import React from 'react';

interface VideoFrameOverlayProps {
  children: React.ReactNode;
}

const VideoFrameOverlay: React.FC<VideoFrameOverlayProps> = ({ children }) => {
  return (
    <div className="relative">
      <div className="inset-0 flex items-center justify-center bg-opacity-50 [&_video]:!w-full">
        {children}
      </div>
      <div className="px-3 absolute top-0 right-0 w-full h-full">
        <div className="flex w-full h-full justify-between">
          <div className="!h-full w-2/12">
            <div className="absolute top-[2%] h-12 w-20 border-t-2 border-r-2	border-white rounded-tr"></div>
            <div className="absolute bottom-[2%] h-12 w-20 border-b-2 border-r-2	border-white rounded-br"></div>
          </div>
          <div className="flex !h-full w-6/12 items-center justify-center">
            <div className="flex h-[60px] w-[60px] justify-between relative">
              <div className="w-2/12">
                <div className="absolute h-3 w-3 top-0 right-0 border-t-2 border-r-2 border-white rounded-tr"></div>
                <div className="absolute h-3 w-3 bottom-0 right-0 border-b-2 border-r-2 border-white rounded-br"></div>
              </div>
              <div className="w-6/12"></div>
              <div className="w-2/12">
                <div className="absolute h-3 w-3 top-0 left-0 border-t-2 border-l-2 border-white rounded-tl"></div>
                <div className="absolute h-3 w-3 bottom-0 left-0 border-b-2 border-l-2 border-white rounded-bl"></div>
              </div>
            </div>
          </div>
          <div className="!h-full w-2/12">
            <div className="absolute left-[3%] top-[2%] h-12 w-20 border-t-2 border-l-2	border-white rounded-tl"></div>
            <div className="absolute left-[3%] bottom-[2%] h-12 w-20 border-b-2 border-l-2	border-white rounded-bl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFrameOverlay;
