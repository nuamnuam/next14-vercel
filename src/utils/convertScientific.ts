export default function convertScientific(val: number | string) {
  if (!val && val != 0) return;
  let x = val.toString();
  if (Math.abs(Number(x)) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x = (Math.pow(10, e - 1) * Number(x)).toString();
      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x = (Math.pow(10, e) / Number(x)).toString();
      x = new Array(e + 1).join('0') + x;
    }
  }
  return x;
}
