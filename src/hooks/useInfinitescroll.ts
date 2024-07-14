import { useEffect, useRef, useState } from 'react';

const OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

const useInfiniteScroll = (totalPage: number) => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(totalPage);
  const [intersectionObserverEntry, setIntersectionObserverEntry] =
    useState<IntersectionObserverEntry | null>(null);

  const ref = useRef(null);

  useEffect(() => setTotal(totalPage), [totalPage]);

  useEffect(() => {
    if (
      !(
        intersectionObserverEntry &&
        intersectionObserverEntry.intersectionRatio < 1
      )
    ) {
      if (page + 1 <= total) setPage(page + 1);
    }
  }, [intersectionObserverEntry]);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0]);
      };

      observer = new IntersectionObserver(handler, OPTIONS);
      observer.observe(ref.current);
    }
    return () => {
      setIntersectionObserverEntry(null);
      observer?.disconnect();
    };
  }, [ref.current, OPTIONS.threshold, OPTIONS.root, OPTIONS.rootMargin]);

  return { ref, page, setPage, setTotal };
};

export default useInfiniteScroll;
