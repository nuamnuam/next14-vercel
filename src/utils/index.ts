export { default as Request } from './request';
export * from './date-format';
export { default as assetsUrl } from './assets-url';
export { default as toEnglishDigits } from './toEnglishDigits';
export { default as toPersianDigits } from './toPersianDigits';
export { default as isNumber } from './isNumber';
export { default as secretString } from './secretString';
export { default as toDollar } from './toDollar';
export { default as toPrice } from './toPrice';
export { default as firstApiValidationError } from './firstApiValidationError';
export { default as removeCommas } from './removeCommas';
export { default as maxDecimal } from './maxDecimal';
export { default as createSlug } from './createSlug';
export { default as externalData } from './externalData';
export { default as isMobileNumber } from './isMobileNumber';
export { default as toStraightNumber } from './toStraightNumber';
export { default as fixFloatingNum } from './fixFloatingNum';
export { default as convertScientific } from './convertScientific';
export { default as removeExpo } from './remove-expo';
export { default as formUploader } from './formUploader';
export { default as chunkArray } from './chunkArray';
export { default as addDashBetweenDateAndHour } from './addDashBetweenDateAndHour';
export { default as maskPhoneNum } from './maskPhoneNum';
export { default as ageCalculator } from './ageCalculator';
export { default as parseTime } from './parseTime';
export { default as handleDecimal } from './handle-decimal';
export { default as normalizeScientificNumber } from './normalize-scientific-number';
export { default as landlinePhoneRegex } from './landlinePhoneRegex';
export { default as getPrecisionCount } from './precisionCount';
export { default as getLang } from './get-lang';
export { default as firebaseApp } from './firebase';
export { default as compareArrays } from './compare-array';
export { default as getDeviceType } from './get-device-type';
export { default as isHTML } from './is-html';

declare global {
  interface Window {
    gtag?: (event: string, action: string, options?: any) => void;
  }
}
