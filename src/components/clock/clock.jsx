import { useState } from "react";
import { useEffect } from "react";

export function Clock() {
  function addZero(i) {
    return i < 10 ? "0" + i : i;
  }

  function getCurrentTime() {
    const date = new Date();
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    return `${hour}:${minute}`;
  }

  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval); // czyść po odmontowaniu
  }, []);

  return <div>{time}</div>;
}
