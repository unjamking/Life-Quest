import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface QuestTimerProps {
  expiryTimestamp?: number;
  className?: string;
}

const calculateTimeLeft = (expiry?: number) => {
  if (!expiry) return null;

  const difference = expiry - Date.now();
  let timeLeft: { days?: number, hours?: number, minutes?: number, seconds?: number } = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const formatTimeLeft = (timeLeft: any): string => {
    if (timeLeft.days > 0) {
        return `${timeLeft.days}d ${timeLeft.hours}h left`;
    }
    if (timeLeft.hours > 0) {
        return `${timeLeft.hours}h ${timeLeft.minutes}m left`;
    }
    if (timeLeft.minutes > 0) {
        return `${timeLeft.minutes}m ${timeLeft.seconds}s left`;
    }
    if (timeLeft.seconds >= 0) {
        return `${timeLeft.seconds}s left`;
    }
    return 'Expired';
};

const QuestTimer: React.FC<QuestTimerProps> = ({ expiryTimestamp, className = "mt-2 text-xs" }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiryTimestamp));

  useEffect(() => {
    if (!expiryTimestamp || Date.now() > expiryTimestamp) {
        if(Object.keys(timeLeft || {}).length > 0) {
            setTimeLeft({});
        }
        return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(expiryTimestamp));
    }, 1000);

    return () => clearTimeout(timer);
  });
  
  if (!expiryTimestamp) return null;

  const isExpired = !timeLeft || Object.keys(timeLeft).length === 0;
  const timeColor = isExpired ? 'text-red-500' : 'text-dark-3 dark:text-light-3';

  return (
    <div className={`flex items-center space-x-1.5 font-semibold ${timeColor} ${className}`}>
      <Timer className="w-3.5 h-3.5" />
      <span>{isExpired ? 'Expired' : formatTimeLeft(timeLeft)}</span>
    </div>
  );
};

export default QuestTimer;
