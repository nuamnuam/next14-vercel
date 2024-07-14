export default function getPrecisionCount(value: number): number {
  const precision = (value + '')?.split('.')?.[1]?.length;
  return precision;
}
