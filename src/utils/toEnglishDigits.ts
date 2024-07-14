export default function toEnglishDigits(value: any = '') {
  const charCodeZero = '۰'.charCodeAt(0);
  return value.replace(/[۰-۹]/g, (w: any) => w.charCodeAt(0) - charCodeZero);
}
