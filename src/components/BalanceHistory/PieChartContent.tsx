import React from 'react';
import { PieChart } from '@/components/Common';
import { useBreakpoint } from '@/hooks';

interface Props {
  data: Array<{
    symbol: string;
    percent: number;
    balance?: number;
    estimatedValue: number;
  }>;
}

const PieChartContent: React.FC<Props> = ({ data }) => {
  const { isMobile } = useBreakpoint();
  return <PieChart data={data} layout={isMobile ? 'vertical' : 'horizontal'} />;
};

export default PieChartContent;
