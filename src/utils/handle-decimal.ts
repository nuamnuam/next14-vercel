import toStraightNumber from './toStraightNumber';

export default function handleDecimal(val: number = 0, decimalNumber: number) {
  return toStraightNumber(Number(val).toFixed(decimalNumber));
}
