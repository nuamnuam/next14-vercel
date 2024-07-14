export default function assetsUrl(path?: string) {
  if (!path) return '';

  return `${process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL}${path}`;
}
