import React from 'react';
import clsx from 'classnames';
import styles from './styles.module.scss';

interface Props {
  min?: number;
  max?: number;
  value: number;
  className?: string;
  step?: number;
  onChange: (val: number) => void;
}

const RangeSlider: React.FC<Props> = ({
  value,
  className,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) => {
  return (
    <div className="slider-range-wrapper relative">
      <input
        type="range"
        className={clsx(
          'dir-ltr h-[5px] w-full appearance-none rounded-lg bg-dark-50',
          styles.rangeSlider,
          className,
        )}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
      <div
        className="absolute left-0 top-[11px] h-[5px] rounded-lg bg-primary-500"
        style={{ width: `${(value * 100) / max}%` }}
      />
    </div>
  );
};

export default RangeSlider;
