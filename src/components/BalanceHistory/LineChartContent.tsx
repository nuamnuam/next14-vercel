import React from 'react';
import { LineChart } from '@/components/Common';
import { toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

type ChartDataObject = Record<string | number, number>;

const LineChartContent: React.FC<{
  height?: string;
  data: ChartDataObject[];
}> = ({ height, data }) => {
  const [global] = useLang(['global']);
  return (
    <LineChart
      data={data}
      height={height}
      caption={`${global.balanceChanges} ${toPersianDigits(
        data?.length || 0,
      )} ${global.atDays}`}
    />
  );
};

export default LineChartContent;
