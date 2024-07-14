import { useEffect, useState } from 'react';

const useInputSuccess = (value?: string | number, error?: string) => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (value && !error) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  }, [value, error]);

  return success;
};

export default useInputSuccess;
