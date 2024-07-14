export default function maskPhoneNumber(phoneNumber: string) {
  const maskedNumber =
    phoneNumber.substring(0, 4) + '****' + phoneNumber.substring(8);
  return maskedNumber;
}
