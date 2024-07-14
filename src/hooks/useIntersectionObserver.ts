import { type RefObject, useCallback, useEffect } from 'react';

function useIntersectionObserver(
  elementRef: RefObject<HTMLElement>,
  onIntersect: () => void,
) {
  const onIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting) onIntersect();
    },
    [onIntersect],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0,
    });
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [onIntersection]);
}

export default useIntersectionObserver;
