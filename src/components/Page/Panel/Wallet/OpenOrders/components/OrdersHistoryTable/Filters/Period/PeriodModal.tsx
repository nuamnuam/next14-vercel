import React, { useEffect, useState } from 'react';
import { type DayValue } from 'react-modern-calendar-datepicker';
import moment from 'jalali-moment';

import { Button, DatePickerInput, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { JALALI_SEVEN_DAYS_AGO, JALALI_TODAY } from '@/utils';
import { useLang } from '@/hooks';

interface Props {
  shouldReset: boolean;
  onClose: (data: {
    formattedStartDate?: string;
    formattedEndDate?: string;
  }) => void;
}

export const periodModalName = 'period-modal';

const PeriodModal: React.FC<Props> = ({ onClose, shouldReset }) => {
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

  const handleSubmit = () => {
    if (!startTime || !endTime) return;

    const formattedStartDate = moment(
      `${startTime?.year}/${startTime?.month}/${startTime?.day}`,
      'jYYYY/jMM/jDD',
    )
      .locale('en')
      .format('YYYY/MM/DD');

    const formattedEndDate = moment(
      `${endTime?.year}/${endTime?.month}/${endTime?.day}`,
      'jYYYY/jMM/jDD',
    )
      .locale('en')
      .format('YYYY/MM/DD');

    handleClose({ formattedStartDate, formattedEndDate });
  };

  useEffect(() => {
    if (shouldReset) {
      setStartTime(undefined);
      setEndTime(undefined);
    }
  }, [shouldReset]);

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
        />
        <DatePickerInput
          name="toman-end"
          label={wallet.endDate}
          placeholder={JALALI_TODAY}
          value={endTime}
          onChange={setEndTime}
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
