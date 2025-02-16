import { FC, useEffect, useState } from "react";
import { formatRelativeTime, formatDateTime } from "@/lib/utils";

interface TimeEmbedProps {
  timestamp: number;
  format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';
  className?: string;
}

const TimeEmbed: FC<TimeEmbedProps> = ({ timestamp, format = 'R', className }) => {
  const [displayTime, setDisplayTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date(timestamp);
      
      switch (format) {
        case 't':
          setDisplayTime(date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
          break;
        case 'T':
          setDisplayTime(date.toLocaleTimeString('en-US'));
          break;
        case 'd':
          setDisplayTime(date.toLocaleDateString('en-US'));
          break;
        case 'D':
          setDisplayTime(date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }));
          break;
        case 'f':
          setDisplayTime(formatDateTime(date, false));
          break;
        case 'F':
          setDisplayTime(formatDateTime(date, true));
          break;
        case 'R':
          setDisplayTime(formatRelativeTime(date));
          break;
      }
    };

    updateTime();
    
    let interval: NodeJS.Timeout;
    if (format === 'R') {
      interval = setInterval(updateTime, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timestamp, format]);

  return (
    <time dateTime={new Date(timestamp).toISOString()} className={className}>
      {displayTime}
    </time>
  );
};

export default TimeEmbed;