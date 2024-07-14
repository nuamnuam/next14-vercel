import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toPersianDigits } from '@/utils';
import Icon from '../Icon';
import { useCountDown, useLang } from '@/hooks';

interface Props {
  initialTime?: number;
  onFinished: () => void;
}

const CountDown: React.FC<Props> = ({ initialTime = 60, onFinished }) => {
  const [global] = useLang(['global']);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [time, setTime] = useState(initialTime);

  const sepratedTime = useCountDown(time);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (time === 0) {
      onFinished();
      return;
    }
    timerRef.current = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [time]);

  const progressWidth = useMemo(() => {
    if (!timerRef.current) return 0;
    return (time / initialTime) * 100;
  }, [time, initialTime]);

  return (
    <div>
      <div className="text-sm font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="ClockCircle-OutLined"
            size={16}
            className="text-dark-200"
          />
          <span className="text-dark-600">{global.timeToExpireAddress}</span>
        </div>
        <span className="text-primary-600">
          {toPersianDigits(sepratedTime)}
        </span>
      </div>
      <div className="mt-2.5 relative w-full h-1 bg-dark-50 after:absolute after:h-full after:left-0 after:top-0 after:bg-primary-500">
        <div
          className="absolute h-full left-0 top-0 bg-primary-500"
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CountDown;
