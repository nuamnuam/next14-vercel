import { useConnectionQuery } from '@/requests/connectivity';
import { useState, useEffect } from 'react';

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

const useNavigatorOnLine = () => {
  const [status, setStatus] = useState(getOnLineStatus());

  const { data } = useConnectionQuery(true, status ? 10000 : 1000);

  useEffect(() => {
    if (data?.code) {
      return setStatus(false);
    }
    return setStatus(true);
  }, [data]);

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return status;
};

export default useNavigatorOnLine;
