type TDeviceTypes = 'web' | 'responsive' | 'pwa';

export default function getDeviceType(): TDeviceTypes {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isPwa =
    typeof window !== 'undefined'
      ? Boolean(localStorage.getItem('pwa'))
      : false;

  if (isMobile) {
    if (isPwa) {
      return 'pwa';
    }
    return 'responsive';
  }
  return 'web';
}
