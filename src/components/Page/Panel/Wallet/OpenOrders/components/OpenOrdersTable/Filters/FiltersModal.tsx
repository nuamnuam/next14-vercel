import { Button, DatePickerInput, Modal } from '@/components/Common';
import React, { useState } from 'react';
import { type DayValue } from 'react-modern-calendar-datepicker';
import moment from 'jalali-moment';

import { useModal } from '@/hooks/useModal';
import { useOrderHistoryStore } from '@/store';
import { BalanceCoinModel } from '@/types/wallet';
import CoinsInputModal from '@/components/Common/Coins/CoinsInputModal';
import { JALALI_SEVEN_DAYS_AGO, JALALI_TODAY } from '@/utils';

import TransactionType from './TransactionType';
import { useLang } from '@/hooks';

export const openOrdersFiltersModalName = 'open-orders-filters-modal';
const OpenOrdersFiltersModal = () => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal } = useModal(openOrdersFiltersModalName);

  const [startTime, setStartTime] = useState<DayValue | undefined>(undefined);
  const [endTime, setEndTime] = useState<DayValue | undefined>(undefined);
  const [selectedCoin, setSelectedCoin] = useState<BalanceCoinModel>();

  const { resetFilters, set_from_date, set_to_date, set_pair, resetHistories } =
    useOrderHistoryStore();

  const handleChangeStarttime = (time: DayValue) => {
    setStartTime(time);
  };

  const handleChangeEndtime = (time: DayValue) => {
    setEndTime(time);
  };

  const handleReset = () => {
    setStartTime(undefined);
    setEndTime(undefined);
    setSelectedCoin(undefined);
    resetFilters();
    closeSyncModal();
  };

  const handleSubmit = () => {
    resetHistories();
    const formattedStartDate = startTime
      ? moment(
          `${startTime?.year}/${startTime?.month}/${startTime?.day}`,
          'jYYYY/jMM/jDD',
        ).format('YYYY/MM/DD')
      : undefined;

    const formattedEndDate = endTime
      ? moment(
          `${endTime?.year}/${endTime?.month}/${endTime?.day}`,
          'jYYYY/jMM/jDD',
        ).format('YYYY/MM/DD')
      : undefined;

    if (formattedStartDate) set_from_date(formattedStartDate);
    if (formattedEndDate) set_to_date(formattedEndDate);
    if (selectedCoin) set_pair(selectedCoin);
    closeSyncModal();
  };

  return (
    <Modal
      sync
      name={openOrdersFiltersModalName}
      onClose={closeSyncModal}
      title={wallet.searchFilter}
      headerIcon="Filters-TwoTone"
    >
      <div className="mb-4 flex items-center gap-4">
        <DatePickerInput
          name="crypto-start"
          label={wallet.startDate}
          placeholder={JALALI_SEVEN_DAYS_AGO}
          value={startTime}
          onChange={handleChangeStarttime}
        />
        <DatePickerInput
          name="crypto-end"
          label={wallet.endDate}
          placeholder={JALALI_TODAY}
          value={endTime}
          onChange={handleChangeEndtime}
        />
      </div>
      <div className="mb-4">
        <TransactionType />
      </div>
      <div className="mb-4">
        <CoinsInputModal
          selectedCoin={selectedCoin}
          onChange={setSelectedCoin}
          onAllClick={() => setSelectedCoin(undefined)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button fullWidth variant="dark" onClick={handleReset}>
          {wallet.clear}
        </Button>
        <Button fullWidth onClick={handleSubmit}>
          {wallet.search1}
        </Button>
      </div>
    </Modal>
  );
};

export default OpenOrdersFiltersModal;
