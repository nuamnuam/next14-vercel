import { verifyCardNumber, isShebaValid } from '@persian-tools/persian-tools';

export const maskCardNumber = (value: string) => {
  return value
    ? value
        ?.split(' ')
        ?.join('')
        ?.match(/.{1,4}/g)
        ?.join(' ')
    : value;
};

export const isValidCardNumber = (value: string) => {
  return verifyCardNumber(+value.split(' ').join('').trim()) as boolean;
};

export const isValidIban = (value: string) => {
  return isShebaValid(value);
};
