"use client"

import { clearMyInterval } from "./clearMyInterval";

export const setMyInterval = (
  callback: () => void,
  interval: number,
  key: string
) => {
  clearMyInterval(key);
  callback();
  const intervalId = setInterval(() => {
    callback();
  }, interval);
  localStorage?.setItem(key, String(intervalId));
};
