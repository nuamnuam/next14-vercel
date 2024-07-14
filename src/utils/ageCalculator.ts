import moment from 'jalali-moment';

function ageCalculator(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
) {
  const year = moment().locale('fa').year();
  const month = moment().locale('fa').month();
  const day = moment().locale('fa').date();

  let age = year - birthYear;
  const differenceMonth = month + 1 - birthMonth;

  if (differenceMonth < 0 || (differenceMonth === 0 && day < birthDay)) {
    age--;
  }

  return age;
}

export default ageCalculator;
