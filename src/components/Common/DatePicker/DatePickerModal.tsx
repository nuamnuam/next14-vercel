import React, { useState } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Modal } from '..';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import {
  Calendar,
  utils,
  type DayValue,
  type Day,
} from '@hassanmojab/react-modern-calendar-datepicker';
import { useModal } from '@/hooks/useModal';

interface Props {
  name: string;
  value?: DayValue;
  defaultValue: DayValue;
  placeholder?: string;
  onChange: (time: DayValue) => void;
  minimumDate?: Day;
  maximumDate?: Day;
}
export const datePickerModalName = 'date-picker-modal';
const DatePickerModal: React.FC<Props> = ({
  name,
  minimumDate,
  maximumDate,
  onChange,
}) => {
  const { closeSyncModal } = useModal(`${name}-${datePickerModalName}`);
  const [selectedDay, setSelectedDay] = useState<DayValue>();

  const handleChange = (e: DayValue) => {
    setSelectedDay(e);
    onChange(e);
    closeSyncModal();
  };

  return (
    <Modal
      sync
      name={`${name}-${datePickerModalName}`}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!px-0 !pt-0 lg:!pb-0 [&>div]:flex [&>div]:justify-center"
      maxWidth={'330px'}
    >
      <Calendar
        value={selectedDay}
        onChange={handleChange}
        shouldHighlightWeekends
        calendarClassName="!shadow-none"
        locale="fa"
        minimumDate={minimumDate}
        maximumDate={maximumDate ?? utils('fa').getToday()}
      />
    </Modal>
  );
};

export default DatePickerModal;
