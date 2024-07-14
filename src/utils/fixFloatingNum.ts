export default function fixFloatingNumber(
  number: number | string,
  toFixed = 1,
) {
  const num = Number(number);
  const factor = Math.pow(10, toFixed);

  const truncatedNum = Math.floor(num * factor) / factor;

  return num % 1 !== 0 ? truncatedNum.toFixed(toFixed) : num.toFixed(0);
}
