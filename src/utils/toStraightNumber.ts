export default function toStraightNumber(value: number | string) {
  return (
    value?.toString()?.replace(/^0+(?!\.)|(?:\.|(\..*?))0+$/gm, '$1') ?? ''
  );
}
