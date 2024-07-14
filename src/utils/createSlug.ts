export default function createSlug(text: string) {
  if (!text) return '';
  let output = text;
  output = output.replace('/', '-');
  output = output.replace('?', '');
  output = output.replace('؟', '');
  output = output.replace('&', '');
  return output.split(' ').join('-');
}
