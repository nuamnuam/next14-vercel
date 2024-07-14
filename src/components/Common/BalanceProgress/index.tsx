import React from 'react';
import clsx from 'classnames';

import { maxDecimal, toPersianDigits, toPrice } from '@/utils';
import { useLang } from '@/hooks';

import Chip from '../Chip';
import CustomTooltip from '../Tooltip';
import Spinner from '../Spinner';

interface Props {
  total: number;
  value: number;
  max?: number;
  label: string;
  symbol: string | undefined;
  onChange: (val: number) => void;
  addClick?: () => void;
  isLoading?: boolean;
  decimal?: number;
  showPercent?: boolean;
  classname?: string;
}

const BalanceProgress: React.FC<Props> = ({
  total = 0,
  value,
  max,
  symbol,
  label,
  isLoading = false,
  decimal = 0,
  showPercent = true,
  classname = '',
  onChange,
}) => {
  const [wallet] = useLang(['wallet']);

  const handleChange = (valPercent: number) => {
    if (max) {
      const maxPercent = (max / total) * 100;
      if (valPercent > maxPercent) return;
    }
    const realValue = (total * valPercent) / 100;
    onChange(realValue);
  };

  const renderPoints = () => {
    const pointsElms = [];
    for (let i = 0; i <= 100; i = i + 25) {
      pointsElms.push(
        <div
          className="top-[-2px] flex cursor-pointer flex-col justify-center p-2 [&:first-child]:pl-0 [&:last-child]:pr-0"
          onClick={() => {
            handleChange(i);
          }}
        >
          <div
            className={clsx(
              'relative h-4 w-4 rounded-lg transition-all duration-300',
              total != 0 && i <= (value / total) * 100
                ? 'bg-primary-500 text-primary-500'
                : 'bg-dark-50 text-dark-200',
            )}
          >
            {showPercent ? (
              <span className="absolute top-0 mt-[18px] text-2xs">
                ٪{toPersianDigits(i)}
              </span>
            ) : null}
          </div>
        </div>,
      );
    }
    return pointsElms;
  };

  return (
    <div className={clsx(classname && classname)}>
      <div className="flex items-center justify-between max-w-[100%]">
        <span className="mb-3 text-xs font-medium text-dark-300">{label}</span>
        <CustomTooltip
          title={wallet.selectAllBalance}
          anchor={
            <div
              className="flex cursor-pointer items-center mb-3"
              onClick={() => {
                onChange(total);
              }}
            >
              <Chip
                label={
                  <div className="flex gap-2 w-fit max-w-[120px] md:max-w-fit">
                    <span className="text-xs md:text-sm">{symbol}</span>
                    <span className="flex items-center gap-2 text-xs md:text-sm">
                      {isLoading ? (
                        <Spinner type="secondary" />
                      ) : (
                        toPersianDigits(toPrice(maxDecimal(total, decimal)))
                      )}
                    </span>
                  </div>
                }
                variant="secondary"
                size="sm"
                classNames="!px-2 md:!px-4"
              />
            </div>
          }
        />
      </div>
      <div className="relative h-2 select-none">
        <div className=" absolute top-[50%] h-1 w-full max-w-full -translate-y-1/2 rounded-lg bg-dark-50 after:absolute after:left-0 after:top-0 after:h-1 after:rounded-lg after:bg-primary-500" />
        <div className="absolute top-[50%] z-[2] flex w-full -translate-y-1/2 flex-row-reverse items-center justify-between">
          {renderPoints()}
        </div>
        <div
          className="absolute top-[50%] left-0 z-[1] h-[3px] max-w-full -translate-y-1/2 rounded-lg bg-primary-500 transition-all duration-300"
          style={{ width: `${total != 0 ? (value / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};

export default BalanceProgress;
