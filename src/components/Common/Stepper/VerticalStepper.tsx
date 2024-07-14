import React from 'react';
import VerticalStep from './VerticalStep';

interface Props {
  steps: Array<{
    label: string;
    value: string;
    variant: 'inactive' | 'complete' | 'done';
  }>;
}

const VerticalStepper: React.FC<Props> = ({ steps }) => {
  return (
    <div className="relative">
      <div className="absolute h-[1px] top-5 right-0 w-full bg-dark-100" />
      <div className="relative flex w-full items-center justify-between">
        {steps.map((item, index) => (
          <VerticalStep
            key={index}
            label={item.label}
            value={item.value}
            variant={item.variant}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalStepper;
