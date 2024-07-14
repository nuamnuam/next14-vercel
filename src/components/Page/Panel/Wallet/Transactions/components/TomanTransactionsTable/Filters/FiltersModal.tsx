import React, { useMemo, useState } from 'react';
import { Button, DatePickerInput, Modal } from '@/components/Common';
import { type DayValue } from 'react-modern-calendar-datepicker';
import Status from './Status';
import { useModal } from '@/hooks/useModal';
import { useTransactionHistoryStore } from '@/store';
import moment from 'jalali-moment';
import { JALALI_SEVEN_DAYS_AGO, JALALI_TODAY } from '@/utils';
import { useLang } from '@/hooks';

export const tomanFiltersModalName = 'toman-filters-modal';
const TomanFiltersModal = () => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal } = useModal(tomanFiltersModalName);
  const [startTime, setStartTime] = useState<DayValue | undefined>(undefined);
  const [endTime, setEndTime] = useState<DayValue | undefined>(undefined);

  const { resetFilters, set_from_date, set_to_date } =
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
    closeSyncModal();
  };

  return (
    <Modal
      sync
      name={tomanFiltersModalName}
      onClose={closeSyncModal}
      title={wallet.searchFilter}
      headerIcon="Filters-TwoTone"
    >
      <div className="mb-4 flex items-center gap-4 justify-between">
        <div className="flex-1">
          <DatePickerInput
            name="toman-start"
            label={wallet.startDate}
            placeholder={JALALI_SEVEN_DAYS_AGO}
            value={startTime}
            onChange={handleChangeStarttime}
            maximumDate={endTime!}
          />
        </div>
        <div className="flex-1">
          <DatePickerInput
            name="toman-end"
            label={wallet.endDate}
            placeholder={JALALI_TODAY}
            value={endTime}
            onChange={handleChangeEndtime}
            minimumDate={startTime!}
          />
        </div>
      </div>
      <div className="mb-6">
        <Status />
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

export default TomanFiltersModal;
