import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import moment from 'jalali-moment';
import clsx from 'classnames';

import { Icon, SelectInput } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useTransactionHistoryStore } from '@/store';
import { toPersianDigits } from '@/utils';

import PeriodModal, { periodModalName } from './PeriodModal';
import { useLang } from '@/hooks';

moment.locale('en');

export const todayDateFormated = moment().locale('en').format('YYYY/MM/DD');

// FIXED: date should be converted from 00:00 hour
const sevenDaysAgo = moment().locale('en').subtract(6, 'days');
export const sevenDaysAgoFormatted = sevenDaysAgo.format('YYYY/MM/DD');

const thirtyDaysAgo = moment().locale('en').subtract(29, 'days');
export const thirtyDaysAgoFormatted = thirtyDaysAgo.format('YYYY/MM/DD');

const ninetyDaysAgo = moment().locale('en').subtract(89, 'days');
export const ninetyDaysAgoFormatted = ninetyDaysAgo.format('YYYY/MM/DD');

interface Props {}

const Period = forwardRef<{}, Props>(({}, ref) => {
  const [wallet] = useLang(['wallet']);

  const [isCustomRangeSelected, setIsCustomRangeSelected] =
    useState<boolean>(false);

  const [customStartSelected, setCustomStartSelected] =
    useState<boolean>(false);
  const [customEndSelected, setCustomEndSelected] = useState<boolean>(false);

  const {
    showSyncModal: showDatePickerModal,
    isSyncModalOpen: isDatePickerModalOpen,
  } = useModal(periodModalName);

  const { from_date, to_date, set_from_date, set_to_date } =
    useTransactionHistoryStore();

  const onChange = (val: string) => {
    if (val === 'custom') {
      setIsCustomRangeSelected(true);
      return;
    }
    setIsCustomRangeSelected(false);
    setCustomStartSelected(false);
    setCustomEndSelected(false);
    const dates = val.split('-');
    set_from_date(dates?.[0]);
    set_to_date(dates?.[1]);
  };
  const customDateString = () => {
    const jalailiFromDate = moment(from_date).format('jYYYY/jMM/jDD');
    const jalailiToDate = moment(to_date).format('jYYYY/jMM/jDD');
    return toPersianDigits(`${jalailiFromDate} - ${jalailiToDate}`);
  };

  const options = useMemo(() => {
    return [
      {
        label: wallet.last7days,
        value: `${sevenDaysAgoFormatted}-${todayDateFormated}`,
      },
      {
        label: wallet.last30days,
        value: `${thirtyDaysAgoFormatted}-${todayDateFormated}`,
      },
      {
        label: wallet.last90days,
        value: `${ninetyDaysAgoFormatted}-${todayDateFormated}`,
      },
      {
        label: wallet.customDateRange,
        value: 'custom',
      },
    ];
  }, [
    from_date,
    to_date,
    isCustomRangeSelected,
    customStartSelected,
    customEndSelected,
  ]);

  const onDatePickerModalClose = (data: {
    formattedStartDate?: string;
    formattedEndDate?: string;
  }) => {
    console.log(data, 'data');
    if (!data.formattedStartDate || !data.formattedEndDate) {
      setIsCustomRangeSelected(false);
      setCustomStartSelected(false);
      setCustomEndSelected(false);
      return;
    }
    setIsCustomRangeSelected(true);
    setCustomStartSelected(true);
    setCustomEndSelected(true);
    set_from_date(data.formattedStartDate);
    set_to_date(data.formattedEndDate);
  };

  useImperativeHandle(ref, () => ({
    resetCustomDates: () => {
      setIsCustomRangeSelected(false);
      setCustomStartSelected(false);
      setCustomEndSelected(false);
    },
  }));

  return (
    <>
      <SelectInput
        name="crypto-period"
        fullWidth
        label={wallet.dateRange}
        value={
          isCustomRangeSelected && customStartSelected && customEndSelected
            ? 'custom'
            : `${from_date || thirtyDaysAgoFormatted}-${
                to_date || todayDateFormated
              }`
        }
        options={options}
        onChange={onChange}
        defaultSelected={`${thirtyDaysAgoFormatted}-${todayDateFormated}`}
        classNames={clsx(
          customStartSelected && customEndSelected && '[&>.relative]:pl-10',
        )}
        onOptionClick={(itemValue) => {
          if (itemValue === 'custom' && !isDatePickerModalOpen) {
            showDatePickerModal();
          }
        }}
      />
      {isCustomRangeSelected && customStartSelected && customEndSelected && (
        <span className="text-primary-600 text-sm flex items-center gap-2 mt-1">
          <Icon icon="CheckCircle-OutLined" size={16} />
          {customDateString()}
        </span>
      )}
      <PeriodModal onClose={onDatePickerModalClose} />
    </>
  );
});

export default Period;
