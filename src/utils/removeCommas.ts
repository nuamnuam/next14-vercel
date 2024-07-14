export default function removeCommas(value: number | string = 0) {
  const valueParts = value.toString().split('.');
  const partOne = valueParts[0].replace(/\,/g, '');
  const partTwo = valueParts[1];

  if (partTwo || partTwo === '') return `${partOne}.${partTwo}`;
  return partOne;
}
