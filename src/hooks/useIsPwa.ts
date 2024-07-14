import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import useBreakpoint from './useBreakpoint';

const usePwaGuide = () => {
  const [isPwa, setIsPwa] = useState<boolean | undefined>(undefined);
  const [remind, setRemind] = useState<boolean>(false);

  const { isDesktop } = useBreakpoint();

  const isiOS = () => {
    return (
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  };

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(display-mode: standalone)').matches
    ) {
      setIsPwa(true);
    } else {
      setIsPwa(false);
    }
  }, []);

  useEffect(() => {
    const isInPwaMode = Boolean(localStorage.getItem('pwa'));
    if (!isPwa && !isDesktop && !isInPwaMode && isiOS()) {
      const remindedBefore = Boolean(Cookies.get('pwa_guide'));
      if (!remindedBefore) {
        setRemind(true);
      }
    }
  }, [isPwa]);

  return { remind };
};

export default usePwaGuide;
