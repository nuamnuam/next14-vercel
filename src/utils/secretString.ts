export default function secretString(
  text: string | number = '',
  firstSec: number = 4,
  lastSec: number = 4,
  secretChar: string = '*',
  secretCharsCount: number = text.toString().length,
) {
  text = text.toString();
  const textLength = text?.length || 0;
  if (!textLength) return;

  let stars = '';
  const first = text.slice(0, firstSec);
  const last = text.slice(-lastSec);
  const numOfStars =
    secretCharsCount || textLength - (first.length + last.length);
  if (numOfStars <= 0) {
    for (let i = 0; i < textLength; i++) {
      stars += secretChar;
    }
    return stars;
  } else {
    for (let i = 0; i < numOfStars; i++) {
      stars += secretChar;
    }
    return first + stars + last;
  }
}
