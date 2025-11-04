"use client"
export const clearMyInterval = (key: string) => {
  const intervalId = localStorage?.getItem(key);
  if (intervalId) {
    clearInterval(intervalId);
    localStorage?.removeItem(key);
  }
};
