export default function maxDecimal(
  value: number | string | undefined,
  count: number = 0,
) {
  if (typeof value === 'undefined') return 0;
  const parts = value?.toString()?.split('.');
  if (!parts) return 0;
  if (parts?.[1]) {
    const decimalPart = parts[1].substring(0, count);
    return decimalPart.length ? parts[0] + '.' + decimalPart : parts[0];
  }
  return value.toString();
}
