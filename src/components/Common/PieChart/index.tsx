import React, { useMemo } from 'react';
import clsx from 'classnames';
import * as Rechart from 'recharts';

import { toPersianDigits, toPrice } from '@/utils';
import { useLang } from '@/hooks';

import Mask from '../Mask';

const COLORS = ['#606EB1', '#E8B100', '#0299F2', '#00DF9A', '#D3D6E3'];

type SectionType = {
  percent: number;
  balance?: number;
  estimatedValue: number;
  symbol?: string;
  color?: string;
};

interface PieProps {
  data: SectionType[];
  layout?: 'horizontal' | 'vertical';
  className?: {
    wrapper?: string;
  };
}

const PieChart: React.FC<PieProps> = ({
  data = [],
  layout = 'horizontal',
  className,
}) => {
  const items = useMemo(() => {
    return data?.map((i) => ({ ...i, percent: Number(i.percent) }));
  }, [data]);

  const hasBalance = useMemo(() => {
    const sum =
      data?.reduce((acc, cr) => acc + Number(cr?.balance ?? 0), 0) ?? 0;
    return !!sum;
  }, [data]);

  const emptySection = useMemo(() => {
    return [
      {
        percent: 100,
        estimatedValue: 0,
        color: '#D3D6E3',
      },
    ];
  }, []);

  return (
    <div
      className={clsx(
        'flex',
        layout === 'horizontal'
          ? 'flex-row items-center'
          : 'flex-col items-center justify-center',
        className?.wrapper,
      )}
    >
      <Rechart.PieChart height={180} width={180}>
        <Rechart.Pie
          height={'auto'}
          data={hasBalance ? items : emptySection}
          innerRadius={60}
          outerRadius={90}
          dataKey="percent"
        >
          {(hasBalance ? items : emptySection).map((entry, index) => (
            <Rechart.Cell
              key={`cell-${index}`}
              fill={entry?.color ?? COLORS[index]}
              stroke="0"
            />
          ))}
        </Rechart.Pie>
      </Rechart.PieChart>
      <div
        className={clsx(
          ' flex-auto',
          layout === 'horizontal' ? 'mr-12' : 'mt-6 w-full',
        )}
      >
        <ChartLabels data={items} />
      </div>
    </div>
  );
};

const ChartLabels: React.FC<{ data: SectionType[] }> = ({ data }) => {
  const [global, wallet] = useLang(['global', 'wallet']);

  return (
    <div className=" flex flex-col gap-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="w-1/3 text-right text-xs text-dark-300">
          {wallet.currencyName}
        </span>
        <span className="w-1/3 text-center text-xs text-dark-300">
          {global.balance}
        </span>
        <span className="w-1/3 text-left text-xs text-dark-300">
          {wallet.estimateValue}
        </span>
      </div>
      {data?.map((item, index) => (
        <div className="flex items-center justify-between" key={index}>
          <div className="flex w-1/3 items-center">
            <div
              className="ml-[10px] h-2 w-2 rounded-sm"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-xs font-medium text-dark-700 ml-1">
              {item?.symbol === 'Other Currencies' || !item?.symbol
                ? wallet.other
                : item?.symbol}
            </span>
            <span className="w-1/3 text-right text-xs text-dark-300 mr-1">
              (
              <Mask count={3}>
                %{toPersianDigits(Math.round(item.percent))}
              </Mask>
              )
            </span>
          </div>
          <span className="block w-1/3 text-center text-xs text-dark-300">
            {!item.symbol ? '-' : <Mask>{toPrice(item.balance ?? 0)}</Mask>}
          </span>
          <span className="dir-ltr block w-1/3 text-xs text-dark-300">
            <Mask>
              {toPrice(Number(item.estimatedValue))} {global.usdt}
            </Mask>
          </span>
        </div>
      ))}
    </div>
  );
};

export default PieChart;
