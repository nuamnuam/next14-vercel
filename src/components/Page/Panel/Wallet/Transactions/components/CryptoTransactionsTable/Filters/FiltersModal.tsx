import { Button, DatePickerInput, Modal } from '@/components/Common';
import React, { useMemo, useState } from 'react';
import { type DayValue } from 'react-modern-calendar-datepicker';
import Status from './Status';
import Txid from './Txid';
import { useModal } from '@/hooks/useModal';
import { useTransactionHistoryStore } from '@/store';
import moment from 'jalali-moment';
import { BalanceCoinModel } from '@/types/wallet';
import CoinsInputModal from '@/components/Common/Coins/CoinsInputModal';
import { coinsModalName } from '@/components/Common/Coins/CoinsModal';
import { JALALI_SEVEN_DAYS_AGO, JALALI_TODAY } from '@/utils';
import { useLang } from '@/hooks';

export const cryptoFiltersModalName = 'crypto-filters-modal';
const CryptoFiltersModal = () => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal } = useModal(cryptoFiltersModalName);
  const { closeSyncModal: closeCoinsModal } = useModal(coinsModalName);
  const [startTime, setStartTime] = useState<DayValue | undefined>(undefined);
  const [endTime, setEndTime] = useState<DayValue | undefined>(undefined);
  const [selectedCoin, setSelectedCoin] = useState<BalanceCoinModel>();

  const { resetFilters, set_from_date, set_to_date, set_currency_id } =
    useTransactionHistoryStore();

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

  const formattedStartDate = useMemo(() => {
    if (startTime) {
      return moment(
        `${startTime?.year}/${startTime?.month}/${startTime?.day}`,
        'jYYYY/jMM/jDD',
      ).format('YYYY/MM/DD');
    }
    return undefined;
  }, [startTime]);

  const formattedEndDate = useMemo(() => {
    if (endTime) {
      return moment(
        `${endTime?.year}/${endTime?.month}/${endTime?.day}`,
        'jYYYY/jMM/jDD',
      ).format('YYYY/MM/DD');
    }
    return undefined;
  }, [endTime]);

  const handleSubmit = () => {
    if (formattedStartDate) set_from_date(formattedStartDate);
    if (formattedEndDate) set_to_date(formattedEndDate);
    set_currency_id(Number(selectedCoin?.currency_id));
    closeSyncModal();
  };

  return (
    <Modal
      sync
      name={cryptoFiltersModalName}
      onClose={closeSyncModal}
      title={wallet.searchFilter}
      headerIcon="Filters-TwoTone"
    >
      <div className="mb-4 flex items-center gap-4 justify-between">
        <div className="flex-1">
          <DatePickerInput
            name="crypto-start"
            label={wallet.startDate}
            placeholder={JALALI_SEVEN_DAYS_AGO}
            value={startTime}
            onChange={handleChangeStarttime}
            maximumDate={endTime!}
          />
        </div>
        <div className="flex-1">
          <DatePickerInput
            name="crypto-end"
            label={wallet.endDate}
            placeholder={JALALI_TODAY}
            value={endTime}
            onChange={handleChangeEndtime}
            minimumDate={startTime!}
          />
        </div>
      </div>
      <div className="mb-4">
        <CoinsInputModal
          selectedCoin={selectedCoin}
          onChange={setSelectedCoin}
          onAllClick={() => {
            setSelectedCoin(undefined);
            closeCoinsModal();
          }}
        />
      </div>
      <div className="mb-4">
        <Status />
      </div>
      <div className="mb-6">
        <Txid />
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

export default CryptoFiltersModal;
