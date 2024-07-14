import React from 'react';
import HorizontalStep from './HorizontalStep';

interface Props {
  steps: Array<{
    label: string;
    value: string;
    variant:
      | 'inactive'
      | 'inProgress'
      | 'complete'
      | 'notComplete'
      | 'error'
      | 'warning'
      | 'info'
      | 'done';
  }>;
}

const HorizontalStepper: React.FC<Props> = ({ steps }) => {
  return (
    <div className="relative">
      <div className="absolute h-[1px] top-2.5 right-0 w-full bg-dark-100" />
      <div className="relative flex w-full items-center justify-between">
        {steps.map((item, index) => (
          <HorizontalStep
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

export default HorizontalStepper;
