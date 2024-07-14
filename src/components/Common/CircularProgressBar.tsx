import React, { useEffect, useState } from 'react';
import clsx from 'classnames';
interface IProps {
  start?: boolean;
  children?: React.ReactNode;
  progressTime?: number;
  handleStopCaptureClick?: () => void;
}
const CircularProgressBar: React.FC<IProps> = ({
  children,
  start,
  progressTime = 15,
  handleStopCaptureClick,
}: IProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let timer: any;
    if (start) {
      timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= progressTime ? 0 : prevProgress + 1,
        );
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [start]);

  useEffect(() => {
    if (start && progress >= progressTime - 1) {
      setTimeout(() => {
        handleStopCaptureClick?.();
      }, 100);
    }
  }, [progress]);

  return (
    <div className="relative mx-auto h-[274px] w-[274px]">
      <svg
        className="absolute top-0 left-0 z-50"
        viewBox="0 0 36 36"
        width="100%"
        height="100%"
      >
        <circle
          className={clsx(
            'stroke-current',
            start ? 'text-primary-500' : 'text-transparent',
          )}
          cx="18"
          cy="18"
          r="16"
          strokeWidth="1"
          fill="none"
          strokeDasharray={`${progress * 1.7}, 100`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default CircularProgressBar;
