export default function addDashBetweenDateAndHour(date: string | undefined) {
  if (!date) return;

  return date
    .split(' ')
    .filter((item) => item)
    .reverse()
    .join(' - ');
}
