import { PieChart } from '@/components/Common';
import { useBreakpoint } from '@/hooks';
import React from 'react';

const PieChartContent = () => {
  const { isMobile } = useBreakpoint();
  return (
    <PieChart
      className={{
        wrapper: 'flex-row-reverse gap-x-12 [&>div]:mr-0',
      }}
      data={pieData}
      layout={isMobile ? 'vertical' : 'horizontal'}
    />
  );
};

export default PieChartContent;

const pieData = [
  { name: 'بیتکوین (BTC)', percent: 53, balance: 0.0057, estimatedValue: 380 },
  { name: 'اتریوم (ETH)', percent: 12, balance: 32, estimatedValue: 380 },
  { name: 'بایننس کوین (BNB)', percent: 12, balance: 1, estimatedValue: 380 },
  { name: 'تتر (USDT)', percent: 47, balance: 890, estimatedValue: 380 },
  { name: 'سایر رمز ارزها', percent: 5, estimatedValue: 380 },
];
