import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  classNames?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, classNames }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video != null) {
      const videoInterval = setInterval(() => {
        if (video.currentTime >= video.duration) {
          setIsPlaying(false);
        }
      }, 1000);

      if (video.paused) {
        video.play();
      } else {
        clearInterval(videoInterval);
        video.pause();
      }
      setIsPlaying(!video.paused);
    }
  };

  return (
    <div className="relative h-full">
      <video
        ref={videoRef}
        src={src}
        className={`m-auto !h-full !w-full ${classNames}`}
        onClick={togglePlay}
      />
      {!isPlaying && (
        <button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full p-2"
          onClick={togglePlay}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_9991_6224)">
              <path
                d="M33.4219 22.0786C34.0875 22.4911 34.5 23.213 34.5 24.0005C34.5 24.788 34.0875 25.5098 33.4219 25.9223L19.9219 34.1723C19.2281 34.5942 18.3563 34.613 17.6531 34.2098C16.9406 33.8161 16.5 33.0661 16.5 32.2505V15.7505C16.5 14.9348 16.9406 14.1848 17.6531 13.7911C18.3563 13.388 19.2281 13.3223 19.9219 13.8286L33.4219 22.0786Z"
                fill="white"
              />
              <path
                opacity="0.4"
                d="M48 24C48 37.2562 37.2562 48 24 48C10.7438 48 0 37.2562 0 24C0 10.7438 10.7438 0 24 0C37.2562 0 48 10.7438 48 24ZM16.5 15.75V32.25C16.5 33.0656 16.9406 33.8156 17.6531 34.2094C18.3563 34.6125 19.2281 34.5938 19.9219 34.1719L33.4219 25.9219C34.0875 25.5094 34.5 24.7875 34.5 24C34.5 23.2125 34.0875 22.4906 33.4219 22.0781L19.9219 13.8281C19.2281 13.3219 18.3563 13.3875 17.6531 13.7906C16.9406 14.1844 16.5 14.9344 16.5 15.75Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_9991_6224">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
