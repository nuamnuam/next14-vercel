import React from 'react';
import clsx from 'classnames';

import { toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

import CustomTooltip from '../Tooltip';

interface Props {
  count: number;
  active: number;
}

const Stepper: React.FC<Props> = ({ count, active }) => {
  const [referral] = useLang(['referral']);

  return (
    <div className="relative">
      <div className="relative z-[1] flex items-center justify-between">
        {Array(count)
          .fill('')
          .map((_, index) => (
            <div key={index}>
              <CustomTooltip
                title={referral['41to200']}
                anchor={
                  <div
                    className={clsx(
                      'bg-white p-[9px]',
                      index === 0 && '!pr-0',
                      index === count - 1 && '!pl-0',
                    )}
                    key={index}
                  >
                    <div
                      className={clsx(
                        'group relative flex h-[21px] w-[21px] select-none items-center justify-center rounded-full pt-[2px] text-sm font-bold leading-6 text-white transition-all duration-300',
                        active > index
                          ? 'bg-primary-200 transition-all duration-300 hover:bg-primary-500'
                          : 'bg-dark-100',
                      )}
                    >
                      {toPersianDigits(index + 1)}
                      <span
                        className={clsx(
                          'absolute -bottom-6 text-xs font-normal',
                          active > index
                            ? 'text-primary-200 transition-all duration-300 group-hover:text-primary-500'
                            : 'text-dark-100',
                        )}
                      >
                        ٪{toPersianDigits(25 + 5 * index)}
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
