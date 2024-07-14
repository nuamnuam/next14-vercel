import React from 'react';
import clsx from 'classnames';
import { toPersianDigits } from '@/utils';
import CustomTooltip from '@/components/Common/Tooltip';

interface Props {
  items: Array<{ title: string; tooltip: string }>;
  activeStep: number;
}

const Stepper: React.FC<Props> = ({ items, activeStep }) => {
  return (
    <div className="relative">
      <div className="relative z-[1] flex items-center justify-between">
        {items.map((item, index) => (
          <div key={index}>
            <CustomTooltip
              title={item.tooltip}
              anchor={
                <div
                  className={clsx(
                    'bg-white p-[9px]',
                    index === 0 && '!pr-0',
                    index === items.length - 1 && '!pl-0',
                  )}
                  key={index}
                >
                  <div
                    className={clsx(
                      'group relative flex h-[21px] w-[21px] select-none items-center justify-center rounded-full pt-[2px] text-sm font-bold leading-6 text-white transition-all duration-300',
                      activeStep === index + 1 && 'bg-primary-500',
                      activeStep > index + 1
                        ? 'bg-primary-200 transition-all duration-300'
                        : 'bg-dark-100',
                    )}
                  >
                    {toPersianDigits(index + 1)}
                    <span
                      className={clsx(
                        'absolute -bottom-6 text-xs font-normal',
                        activeStep === index + 1 && 'text-primary-500',
                        activeStep > index + 1
                          ? 'text-primary-200 transition-all duration-300 '
                          : 'text-dark-100',
                      )}
                    >
                      ٪{toPersianDigits(item.title)}
                    </span>
                  </div>
                </div>
              }
            />
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 w-full border-t border-dark-100" />
    </div>
  );
};

export default Stepper;
