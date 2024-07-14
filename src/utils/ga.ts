export const pageview = (url: string) => {
  if (
    window &&
    'gtag' in window &&
    window.hasOwnProperty('gtag') &&
    window?.gtag != null
  )
    window?.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string, {
      page_path: url,
    });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (
    window &&
    'gtag' in window &&
    window.hasOwnProperty('gtag') &&
    window?.gtag != null
  )
    window?.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
};
