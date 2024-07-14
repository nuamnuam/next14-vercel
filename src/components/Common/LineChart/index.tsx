import React, { useMemo } from 'react';
import * as Rechart from 'recharts';
import { colors } from '@/designTokens';
import { toPersianDigits, toPrice } from '@/utils';
import { useGlobalStore } from '@/store';
import Mask from '../Mask';

type ChartData = Record<string | number, number>;

interface Props {
  data: ChartData[];
  caption?: string;
  height?: string;
  strokeColors?: string[];
  tickFormatter?: (text: string | number) => string;
}
const LineChart: React.FC<Props> = ({
  data = [],
  caption,
  height = 'h-full',
  strokeColors = [colors.primary[500], colors.blue[500]],
  tickFormatter,
}) => {
  const isMaskedValue = useGlobalStore((state) => state.isMaskedValue);

  const chartData = useMemo(() => {
    return data;
    // return isMaskedValue ? data?.map((i) => ({ ...i, date: 0 })) : data;
  }, [data, isMaskedValue]);

  const dataKeys = data?.length ? Object.keys(data[0]) : null;

  return (
    <div className={height}>
      <Rechart.ResponsiveContainer width="100%" height={'100%'}>
        <Rechart.LineChart data={chartData}>
          <Rechart.CartesianGrid stroke={colors.dark.grey4} />
          <Rechart.XAxis tick={false} hide />
          <Rechart.Tooltip content={<CustomTooltip />} />
          <Rechart.YAxis
            stroke={colors.dark.grey4}
            textAnchor="end"
            tickMargin={8}
            tickSize={0}
            tick={{
              fill: colors.dark[300],
              fontSize: '10px',
              direction: 'ltr',
            }}
            tickFormatter={(text) =>
              tickFormatter != null
                ? tickFormatter(text)
                : isMaskedValue
                ? '*****'
                : toPersianDigits(text)
            }
          />
          {dataKeys != null &&
            Array(dataKeys.length)
              .fill('')
              .map((_, index) => (
                <Rechart.Line
                  key={index}
                  dataKey={dataKeys[index]}
                  stroke={strokeColors[index]}
                  strokeWidth={2}
                  dot={{ fill: strokeColors[index], strokeWidth: 0, r: 5 }}
                />
              ))}
        </Rechart.LineChart>
      </Rechart.ResponsiveContainer>
      <span className="mt-[19px] block text-center text-xxs font-medium text-dark-500">
        {caption}
      </span>
    </div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload?.length) {
    const payloadKeys = Object.keys(payload[0].payload);
    return (
      <div className="flex flex-col rounded-md border border-dark-100 bg-white px-2 py-1 justify-center text-xs font-medium shadow-sm">
        {payload.map((item, index) => (
          <span
            key={index}
            style={{ color: item.stroke }}
            className="block dir-ltr"
          >
            <Mask>{toPrice(item.payload[payloadKeys[index]])}</Mask>
          </span>
        ))}
      </div>
    );
  }

  return null;
};

export default LineChart;
