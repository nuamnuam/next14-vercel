export default function normalizeScientificNumber(value: string) {
  const [coefficient, exponent] = value.split('e+');
  if (exponent) {
    const baseNumber = parseFloat(coefficient.replace('۰', '0'));

    const result = baseNumber * Math.pow(10, parseInt(exponent));
    return result.toLocaleString(undefined, {
      maximumFractionDigits: 20,
      useGrouping: false,
    });
  }
  return value;
}
