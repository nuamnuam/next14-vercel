export default function toPersianDigits(value: any = '') {
  const charCodeZero = '۰'.charCodeAt(0);
  return String(value).replace(/[0-9]/g, (w) =>
    String.fromCharCode(w.charCodeAt(0) + charCodeZero - 48),
  );
}
