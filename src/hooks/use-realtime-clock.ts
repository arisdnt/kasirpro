import { useEffect, useState } from "react";

export function useRealtimeClock(interval = 30_000) {
  const [timestamp, setTimestamp] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimestamp(new Date());
    }, interval);
    return () => window.clearInterval(id);
  }, [interval]);

  return timestamp;
}
