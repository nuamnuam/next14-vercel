export default function isValidName(
  name: string,
  onChange: (...event: any[]) => void,
) {
  if (
    /^[ \u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06AF\u06A9\u06CC\u200B\u200C\a-zA-Z]+$/g.test(
      name,
    ) ||
    name === ''
  ) {
    onChange(name);
  }
}
