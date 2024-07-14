export default function isNumber(value: any = '') {
  const p = /^[0-9]*\.?[0-9]*$/;
  return p.test(value);
}
