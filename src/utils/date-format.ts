import { format } from 'date-fns';
import moment from 'jalali-moment';

import toPersianDigits from './toPersianDigits';
import getLang from './get-lang';

const [global] = getLang(['global']);

export const timestampToPersianDate = (timestamp: number | string) => {
  if (timestamp) {
    moment.locale('fa', { useGregorianParser: true });
    return toPersianDigits(moment(timestamp).format('DD MMMM , YYYY'));
  }
};

export const formatedDate = ({
  date,
  locale,
  withExtra = true,
  hasSeconds = true,
}: {
  date: number | string | undefined;
  locale?: 'en' | 'fa';
  withExtra?: boolean;
  hasSeconds?: boolean;
}) => {
  if (!date) {
    return;
  }
  moment.locale(locale || 'en', { useGregorianParser: true });

  if (withExtra)
    return toPersianDigits(
      moment(date).format(`${hasSeconds ? 'HH:mm:ss' : 'HH:mm'}  YYYY/MM/DD`),
    );
  return toPersianDigits(moment(date).format('YYYY/MM/DD'));
};

export default function dateFormat(
  date: string | undefined,
  f: string = 'io MMMM yyyy',
) {
  if (!date) return;
  return format(new Date(date), f);
}

export const timeAgo = (input: string | Date, hasSeconds: boolean = false) => {
  if (!input) return '';

  const nowDate = new Date();
  const inputDate = new Date(input);

  const nowUTC = nowDate.getTime() + nowDate.getTimezoneOffset() * 60000;
  const inputUTC = inputDate.getTime() + inputDate.getTimezoneOffset() * 60000;

  const diff = (nowUTC - inputUTC) / 1000;
  let leftSec = Math.floor(diff);

  const days = Math.floor(diff / (24 * 60 * 60));
  if (days > 90)
    return toPersianDigits(
      moment(inputDate).format(
        `${hasSeconds ? 'HH:mm:ss' : 'HH:mm'} YYYY/MM/DD`,
      ),
    );

  if (days) {
    leftSec = diff - days * 24 * 60 * 60;
    return `${toPersianDigits(days)} ${global.daysAgo}`;
  }

  const hrs = Math.floor(leftSec / (60 * 60));
  if (hrs) {
    leftSec = leftSec - hrs * 60 * 60;
    return `${toPersianDigits(hrs)} ${global.hoursAgo}`;
  }

  const min = Math.floor(leftSec / 60);
  if (min) {
    leftSec = leftSec - min * 60;
    return `${toPersianDigits(min)} ${global.minutesAgo}`;
  }

  return global.secondsAgo;
};

export const convertJalaliToGregorianDate = (date: string): string => {
  moment.locale('en', { useGregorianParser: true });
  return moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
};

export const today = () => {
  moment.locale('en', { useGregorianParser: true });
  return moment().format('YYYY-MM-DD');
};

export const JALALI_TODAY = toPersianDigits(
  moment().locale('fa').format('YYYY-MM-DD'),
);

export const JALALI_SEVEN_DAYS_AGO = toPersianDigits(
  moment().locale('fa').subtract(7, 'days').format('YYYY-MM-DD'),
);
