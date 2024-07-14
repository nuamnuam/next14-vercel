import React, { FC } from 'react';

import { useBreakpoint } from '@/hooks';
import { Chip, Icon } from '@/components/Common';
import { fixFloatingNum, toPersianDigits } from '@/utils';
import { type Variant } from '@/components/Common/Chip';

import Content from './Content';
import ResponsiveContent from './ResponsiveContent';

type Props = {
  wrapperClassname?: string;
  withNewestPairs?: boolean;
  showChartBoxes?: boolean;
};

const MarketTable: FC<Props> = ({
  wrapperClassname,
  withNewestPairs = true,
  showChartBoxes = true,
}) => {
  const { isDesktop } = useBreakpoint();

  if (isDesktop)
    return (
      <Content
        showChartBoxes={showChartBoxes}
        wrapperClassname={wrapperClassname}
        withNewestPairs={withNewestPairs}
      />
    );
  return <ResponsiveContent />;
};

export default MarketTable;

export { default as AdvanceMarketTable } from './TableContent';
export { default as ResponiveTableContent } from './ResponiveTableContent';

export const renderChip = (
  value: number,
  transparentBg: boolean = false,
  onClick?: () => void,
  floatCount: number = 2,
) => {
  const getInfo = () => {
    const state = value > 0 ? 'UP' : value < 0 ? 'DOWN' : 'SAME';
    switch (state) {
      case 'UP':
        return {
          icon: 'ArrowTop-TwoTone',
          variant: 'success',
        };
      case 'DOWN':
        return {
          icon: 'ArrowDown-TwoTone',
          variant: 'danger',
        };
      case 'SAME':
        return {
          icon: '',
          variant: 'secondary',
        };
    }
  };

  const { icon, variant } = getInfo();
  return (
    <Chip
      label={`% ${toPersianDigits(fixFloatingNum(value, floatCount))}`}
      classNames={
        variant === 'secondary'
          ? ' dir-ltr [&_span]:mr-0 text-sm font-normal'
          : ' dir-ltr gap-2 !px-1 text-sm font-normal'
      }
      variant={variant as Variant}
      transparentBg={transparentBg}
      onClick={onClick}
      icon={
        <Icon
          icon={icon}
          size={16}
          className={`[&>*]:fill-${
            variant === 'secondary' ? 'dark' : variant
          }-400`}
        />
      }
    />
  );
};
