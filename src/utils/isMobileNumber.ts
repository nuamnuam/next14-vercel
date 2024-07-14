import toEnglishDigits from './toEnglishDigits';

export default function isMobileNumber(value: any = '') {
  return /^09\d{9}$/.test(toEnglishDigits(value));
}
