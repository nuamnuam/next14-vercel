export type MediaType = '.mp4';

export default function mediaType(type: MediaType) {
  switch (type) {
    case '.mp4':
      return 'video';
    default:
      return 'img';
  }
}
