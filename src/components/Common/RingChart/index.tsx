import { colors } from '@/designTokens';
import { toPrice } from '@/utils';
import React, { useMemo } from 'react';

interface RingChartProps {
  min: number;
  max: number;
  value: number;
  unit: string;
  showRange?: boolean;
  caption?: React.ReactNode;
}

const RingChart: React.FC<RingChartProps> = ({
  min,
  max,
  value,
  unit = 'M',
  showRange = true,
  caption,
}) => {
  const valuePercent = useMemo(() => {
    const range = max - min;
    const val = value > max ? max : value;
    return ((val - min) / 2 / range) * 100;
  }, [min, max, value]);

  return (
    <div className="">
      <div className="flex w-fit items-end justify-between p-4">
        {showRange && (
          <span className="dir-ltr ml-1 text-2xs text-dark-400">
            {toPrice(max)} {unit}
          </span>
        )}
        <div className="max-w-[180px]overflow-hidden relative h-24  w-[180px] flex-1">
          <svg viewBox="0 0 36 36" className="-rotate-90">
            <path
              d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="transparent"
              stroke={colors.dark[50]}
              strokeWidth="2"
              strokeDasharray="50,100"
              strokeLinecap="round"
            />
          </svg>
          <svg
            viewBox="0 0 36 36"
            className=" absolute left-0 top-0 -rotate-90"
          >
            <path
              d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="transparent"
              stroke={colors.primary[500]}
              strokeWidth="2"
              strokeDasharray={`${valuePercent},100`}
              strokeLinecap="round"
            />
          </svg>

          {caption && (
            <div className="absolute bottom-0 right-0 left-0 translate-y-1/2">
              {caption}
            </div>
          )}
        </div>
        {showRange && (
          <span className="dir-ltr mr-1 text-2xs text-dark-400">
            {toPrice(min)} {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default RingChart;
