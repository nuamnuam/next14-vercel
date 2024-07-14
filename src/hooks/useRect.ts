import { useState, useEffect } from 'react';

const useRect = (ref: React.RefObject<HTMLElement>) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current != null) {
        setRect(ref.current.getBoundingClientRect());
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return rect;
};

export default useRect;
