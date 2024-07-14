import React from 'react';
import { LineChart } from '@/components/Common';
import { toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

type ChartDataObject = Record<string | number, number>;

const LineChartContent: React.FC<{
  height?: string;
  data: ChartDataObject[];
}> = ({ height, data }) => {
  const [panelDashboard] = useLang(['panelDashboard']);
  return (
    <LineChart
      data={data}
      height={height}
      caption={`${panelDashboard.balanceChanges} ${toPersianDigits(
        data?.length || 0,
      )} ${panelDashboard.atDays}`}
    />
  );
};

export default LineChartContent;
