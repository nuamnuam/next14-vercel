export default function parseTime(time: string) {
  const [hour, min, second] = time.split(':');

  const hourToMS = parseInt(hour) * 3600000;
  const minToMS = parseInt(min) * 60000;
  const secondToMS = parseFloat(second) * 1000;

  return hourToMS + minToMS + secondToMS;
}
