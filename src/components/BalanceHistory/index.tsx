import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'classnames';

import { maxDecimal } from '@/utils';
import { useBalancesHistory } from '@/requests/panel/wallet/getBalancesHistory';
import { useWalletBalanceStore } from '@/store';
import { useLang } from '@/hooks';

import LineChartContent from './LineChartContent';
import PieChartContent from './PieChartContent';
import RadioGroup from '../RadioGroup';

interface Props {
  title?: string;
}

const BalanceHistory: React.FC<Props> = ({ title }) => {
  const [wallet] = useLang(['wallet']);
  useBalancesHistory();

  const { balanceHistory } = useWalletBalanceStore();

  const [chartProperty, setChartProperty] = useState('change_property');

  const lineChartData = useMemo(() => {
    return balanceHistory.perDay
      ? Object.keys(balanceHistory.perDay)?.map((item) => ({
          date: Number(maxDecimal(balanceHistory.perDay[item].USDT, 0)),
        }))
      : [];
  }, [balanceHistory]);

  const pieChartData = useMemo(() => {
    return balanceHistory.top_wallets?.map((item) => {
      return {
        symbol: item.symbol,
        percent: item.percentage,
        balance: item.balance,
        estimatedValue: item.totalUSDT,
      };
    });
  }, [balanceHistory]);

  const renderChart = useCallback(() => {
    if (!chartProperty) return;
    return chartProperty === 'change_property' ? (
      <LineChartContent height="h-[155px]" data={lineChartData} />
    ) : (
      <PieChartContent data={pieChartData} />
    );
  }, [chartProperty, lineChartData, pieChartData]);

  return (
    <div className={clsx(chartProperty === 'change_property' && 'pb-12')}>
      <div className="items-center justify-between flex ">
        {title && (
          <p className="text-base font-normal text-dark-800">{title}</p>
        )}
        <RadioGroup
          switchTheme
          options={[
            {
              key: 'complex_property',
              label: wallet.balanceCompose,
              value: 'complex_property',
            },
            {
              key: 'change_property',
              label: wallet.balanceChange,
              value: 'change_property',
            },
          ]}
          defaultSelected={chartProperty}
          onChange={setChartProperty}
          className={{ wrapper: title ? 'w-[263px]' : 'w-full' }}
        />
      </div>
      <div className="mt-7 hidden md:block">{renderChart()}</div>
    </div>
  );
};

export default BalanceHistory;
