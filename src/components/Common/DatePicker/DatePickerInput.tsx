import React, { useMemo } from 'react';
import moment from 'jalali-moment';
import {
  type DayValue,
  type Day,
} from '@hassanmojab/react-modern-calendar-datepicker';

import { toPersianDigits } from '@/utils';
import { useModal } from '@/hooks/useModal';

import DatePickerModal, { datePickerModalName } from './DatePickerModal';
import Icon from '../Icon';

const today = moment().locale('fa').format('YYYY-MM-DD');

const [year, month, day] = today.split('-');

const YEAR_AGO_DAY_OBJ: Day = {
  year: Number(year) - 1,
  month: Number(month),
  day: Number(day),
};
interface Props {
  name: string;
  value?: DayValue;
  defaultValue?: DayValue;
  label?: string;
  onChange: (time: DayValue) => void;
  placeholder: string;
  minimumDate?: Day;
  maximumDate?: Day;
}

const DatePickerInput: React.FC<Props> = ({
  name,
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  minimumDate,
  maximumDate,
}) => {
  const { showSyncModal } = useModal(`${name}-${datePickerModalName}`);

  const renderValue = useMemo(() => {
    if (value == null) return;
    const { day, month, year } = value;
    return toPersianDigits(`${year}-${month}-${day}`);
  }, [value]);

  return (
    <>
      <div
        onClick={() => {
          showSyncModal();
        }}
        className="w-full border-primary-600"
      >
        {label && (
          <span className="mb-2 block text-sm text-dark-600">{label}</span>
        )}
        <div className="flex h-10 items-center justify-start rounded-lg border border-dark-200 bg-white py-2 px-3">
          <Icon icon="Calendar-OutLined" className="text-dark-500" size={16} />
          <div className="mr-3">
            {value != null ? (
              <span className="text-sm  text-dark-600">{renderValue}</span>
            ) : (
              <span className="text-sm text-dark-200">{placeholder}</span>
            )}
          </div>
        </div>
      </div>
      <DatePickerModal
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        minimumDate={minimumDate || YEAR_AGO_DAY_OBJ}
        maximumDate={maximumDate}
      />
    </>
  );
};

export default DatePickerInput;
