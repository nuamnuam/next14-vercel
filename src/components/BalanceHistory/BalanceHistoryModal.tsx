import React, { useMemo } from 'react';

import { Card, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import useWalletBalanceStore from '@/store/useWalletBalanceStore';
import { maxDecimal } from '@/utils';
import { useBalancesHistory } from '@/requests/panel/wallet/getBalancesHistory';
import MaskButton from '../Common/Mask/MaskButton';
import { useLang } from '@/hooks';

import LineChartContent from './LineChartContent';
import PieChartContent from './PieChartContent';

export const balanceHistoryModalName = 'balance-history-modal';
const BalanceHistoryModal = () => {
  const [wallet] = useLang(['wallet']);
  useBalancesHistory();

  const { balanceHistory } = useWalletBalanceStore();

  const { closeModal } = useModal(balanceHistoryModalName);

  const lineChartData = useMemo(() => {
    return balanceHistory.perDay
      ? Object.keys(balanceHistory.perDay)?.map((item) => ({
          date: Number(maxDecimal(balanceHistory.perDay[item].USDT, 0)),
        }))
      : [];
  }, [balanceHistory]);

  const pieChartData = useMemo(() => {
    return balanceHistory.top_wallets?.map((item) => ({
      symbol: item.symbol,
      percent: item.percentage,
      balance: item.balance,
      estimatedValue: item.totalUSDT,
    }));
  }, [balanceHistory]);

  return (
    <Modal
      noTransition
      name={balanceHistoryModalName}
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
      fullScreen
      title={wallet.balancesChart}
      hasHelp={false}
      extra={<MaskButton size="lg" />}
    >
      <Card classNames="pb-12 mb-6">
        <h2 className="m-0 border-b border-dark-50 py-7 px-6 text-dark-800">
          {wallet.balancesChanges}
        </h2>
        <div className="h-5 bg-dark-50 opacity-40" />
        <div className="p-[18px] pl-0">
          <LineChartContent height="h-[155px]" data={lineChartData} />
        </div>
      </Card>
      <Card classNames="mb-6">
        <h2 className="m-0 border-b border-dark-50 py-7 px-6 text-dark-800">
          {wallet.balancesCompose}
        </h2>
        <div className="h-5 bg-dark-50 opacity-40" />
        <div className="p-[18px]">
          <PieChartContent data={pieChartData} />
        </div>
      </Card>
    </Modal>
  );
};

export default BalanceHistoryModal;
