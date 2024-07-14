import { Card, Chip, RingChart, BoxDivider } from '@/components/Common';
import { useLang, useProfile } from '@/hooks';
import { toPersianDigits, toPrice, toStraightNumber } from '@/utils';
import React from 'react';

const CommissionLevel = () => {
  const [commissionLang] = useLang(['commisson']);

  const { data: profileInfo } = useProfile();
  const { commission } = profileInfo || {};

  return (
    <Card classNames="mb-6 lg:mb-8">
      <div className="p-4 md:px-6 lg:py-6">
        <h1 className="mt-0 mb-2 font-medium text-dark-800">
          {commissionLang.yourCurrentFeeLevel}
        </h1>
        <span className="block text-2xs text-dark-600">
          {commissionLang.commissionLevelDesc}
        </span>
      </div>
      <BoxDivider />
      <div className="flex flex-col p-4 md:px-6 lg:flex-row lg:py-6">
        <div className="mb-10 flex flex-col items-center lg:mb-0 lg:pl-24">
          <span className="mb-2 flex items-center text-sm text-dark-600">
            {commissionLang.dollarTrades30days}
          </span>
          <RingChart
            min={Number(commission?.['commission-volume']?.min ?? 0)}
            max={Number(commission?.['commission-volume']?.max ?? 0)}
            unit=""
            value={Number(commission?.['dollar-equivalent-30-days'] || 0)}
            caption={
              <div className="flex flex-col items-center">
                <span className="mb-1 font-medium text-dark-600">
                  $
                  {toPrice(
                    toStraightNumber(
                      Number(
                        commission?.['dollar-equivalent-30-days'] || 0,
                      ).toFixed(2),
                    ),
                  )}
                </span>
              </div>
            }
          />
          <Chip
            label={toPersianDigits(commission?.['commission-level-name'] ?? '')}
            classNames="mt-3"
          />
        </div>
        <div className="flex-auto">
          <div className="flex items-center border-b border-dark-50">
            <span className="ml-auto whitespace-pre p-2 text-xs  text-dark-500 md:p-4 lg:pr-6">
              {commissionLang.advancedTradeFee}
            </span>
            <span className="w-1/2 px-2 text-left text-xs text-dark-600 md:p-4 lg:w-3/12 flex justify-end gap-1">
              ٪{toPersianDigits(commission?.['p2p-trading-fees'].maker ?? '')}
              <span className="mr-1 text-2xs text-dark-300">
                {commissionLang.maker}
              </span>
            </span>
            <span className="w-1/4 px-2 py-4 text-left text-xs text-dark-600 md:p-4 lg:w-3/12 flex justify-end gap-1">
              ٪{toPersianDigits(commission?.['p2p-trading-fees'].taker ?? '')}
              <span className="mr-1 text-2xs text-dark-300">
                {commissionLang.taker}
              </span>
            </span>
          </div>
          <div className="flex items-center border-b border-dark-50">
            <span className="ml-auto whitespace-pre p-2 text-xs  text-dark-500 md:p-4 lg:pr-6">
              {commissionLang.instantTradeFeeDiscount}
            </span>
            <span className="w-1/4 px-2 py-4 text-left text-xs text-dark-600 md:p-4 lg:w-3/12 flex justify-end gap-1">
              ٪{toPersianDigits(commission?.['otc-trading-fee-discount'] ?? '')}
            </span>
          </div>
          <div className="flex items-center">
            <span className="ml-auto whitespace-pre p-2 text-xs  text-dark-500 md:p-4 lg:pr-6">
              {commissionLang.convertFeeDiscount}
            </span>
            <span className="w-1/4 px-2 py-4 text-left text-xs text-dark-600 md:p-4 lg:w-3/12 flex justify-end gap-1">
              ٪{toPersianDigits(commission?.['conversion-fee-discount'] ?? '')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommissionLevel;
