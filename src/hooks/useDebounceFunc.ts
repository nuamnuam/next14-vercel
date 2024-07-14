import { useCallback, useRef } from 'react';

type CallbackType = (...args: any[]) => void;

const useDebounceFunc = (debounceDelay: number, callback: CallbackType) => {
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);

  const funcTrigger = useCallback(
    (...args: any) => {
      timeoutRef.current != null && clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback.apply(null, args);
      }, debounceDelay);
    },
    [callback, debounceDelay],
  );
  return funcTrigger;
};

export default useDebounceFunc;
