import { useEffect, useState } from 'react';

// VALUE BASED ON SECONDS
const useCountDown = (sec: number) => {
  const [output, setOutput] = useState<string>();

  useEffect(() => {
    let hours = String(Math.floor(sec / 3600));
    let minutes = String(Math.floor((sec - Number(hours) * 3600) / 60));
    let seconds = String(sec - Number(hours) * 3600 - Number(minutes) * 60);

    if (Number(hours) < 10) {
      hours = '0' + hours;
    }
    if (Number(minutes) < 10) {
      minutes = '0' + minutes;
    }
    if (Number(seconds) < 10) {
      seconds = '0' + seconds;
    }

    setOutput(hours + ':' + minutes + ':' + seconds);
  }, [sec]);

  return output; // Return is HH : MM : SS
};

export default useCountDown;
