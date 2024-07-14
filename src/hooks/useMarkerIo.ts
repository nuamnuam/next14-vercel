import markerSDK, { MarkerSdk } from '@marker.io/browser';
import { useEffect, useState } from 'react';

const MARKER_ID =
  process.env.NEXT_PUBLIC_MARKER_IO_PROJECT_ID || '660525f820bbcdc9ab234051';

export default function useMarkerio() {
  const [widget, setWidget] = useState<MarkerSdk | null>(null);

  useEffect(() => {
    markerSDK
      .loadWidget({
        project: MARKER_ID,
      })
      .then(setWidget);
  }, [markerSDK]);

  return widget;
}
