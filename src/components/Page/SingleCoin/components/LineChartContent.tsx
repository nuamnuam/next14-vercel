import { LineChart } from '@/components/Common';
import React from 'react';

const LineChartContent: React.FC<{ height?: string }> = ({ height }) => {
  return <LineChart data={lineData} height={height} />;
};

export default LineChartContent;

const lineData = [
  {
    price: 25,
  },
  {
    price: 45,
  },
  {
    price: 25,
  },
  {
    price: 90,
  },
  {
    price: 60,
  },
  {
    price: 75,
  },
  {
    price: 25,
  },
];
