import React, { useMemo, useState } from 'react';
import moment from 'jalali-moment';
import { Button, DatePickerInput, Modal } from '@/components/Common';
import { type DayValue } from 'react-modern-calendar-datepicker';
import { useModal } from '@/hooks/useModal';
import { JALALI_SEVEN_DAYS_AGO, JALALI_TODAY } from '@/utils';
import { useLang } from '@/hooks';

interface Props {
  onClose: (data: {
    formattedStartDate?: string;
    formattedEndDate?: string;
  }) => void;
}

export const periodModalName = 'period-modal';
const PeriodModal: React.FC<Props> = ({ onClose }) => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal } = useModal(periodModalName);
  const [startTime, setStartTime] = useState<DayValue>();
  const [endTime, setEndTime] = useState<DayValue>();

  const handleClose = (data: {
    formattedStartDate?: string;
    formattedEndDate?: string;
  }) => {
    closeSyncModal();
    onClose(data);
  };

  const formattedStartDate = useMemo(
    () =>
      moment(
        `${startTime?.year}/${startTime?.month}/${startTime?.day}`,
        'jYYYY/jMM/jDD',
      )
        .locale('en')
        .format('YYYY/MM/DD'),
    [startTime],
  );

  const formattedEndDate = useMemo(
    () =>
      moment(
        `${endTime?.year}/${endTime?.month}/${endTime?.day}`,
        'jYYYY/jMM/jDD',
      )
        .locale('en')
        .format('YYYY/MM/DD'),
    [endTime],
  );

  const handleSubmit = () => {
    if (!startTime || !endTime || !formattedStartDate || !formattedEndDate)
      return;
    handleClose({ formattedStartDate, formattedEndDate });
  };

  return (
    <Modal
      sync
      name={periodModalName}
      onClose={() => handleClose({})}
      title={wallet.setCustomRange}
      headerIcon="Filters-TwoTone"
    >
      <span className="mb-6 block text-sm text-dark-500">
        {wallet.customRangeNote}
      </span>
      <div className="flex items-center gap-4">
        <DatePickerInput
          name="toman-start"
          label={wallet.startDate}
          placeholder={JALALI_SEVEN_DAYS_AGO}
          value={startTime}
          onChange={setStartTime}
          maximumDate={endTime!}
        />
        <DatePickerInput
          name="toman-end"
          label={wallet.endDate}
          placeholder={JALALI_TODAY}
          value={endTime}
          onChange={setEndTime}
          minimumDate={startTime!}
        />
      </div>
      <Button
        className="mt-6"
        fullWidth
        onClick={handleSubmit}
        disabled={!startTime || !endTime}
      >
        {wallet.select}
      </Button>
    </Modal>
  );
};

export default PeriodModal;
