import { useState, useEffect } from 'react';
import { differenceInSeconds, formatDistanceToNow, isPast } from 'date-fns';

interface CountdownProps {
  targetDate: string;
  onExpire?: () => void;
}

export default function Countdown({ targetDate, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate);

    const updateCountdown = () => {
      if (isPast(target)) {
        setIsExpired(true);
        setTimeLeft('Expired');
        onExpire?.();
        return;
      }

      const seconds = differenceInSeconds(target, new Date());

      if (seconds < 60) {
        setTimeLeft(`${seconds}s`);
      } else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        setTimeLeft(`${mins}m ${secs}s`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        setTimeLeft(`${hours}h ${mins}m`);
      } else {
        setTimeLeft(formatDistanceToNow(target, { addSuffix: false }));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  return (
    <span className={isExpired ? 'text-red-500' : 'text-gray-600'}>
      {timeLeft}
    </span>
  );
}
