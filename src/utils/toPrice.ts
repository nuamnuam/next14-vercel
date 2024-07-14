import toPersianDigits from './toPersianDigits';

export default function toPrice(value: number | string) {
  const parts = value?.toString()?.split('.');
  if (!parts) return;

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianConvertion = toPersianDigits(parts.join('.').toString());
  return persianConvertion;
}
