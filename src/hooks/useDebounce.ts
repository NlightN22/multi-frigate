import { useRef } from "react";

export const useDebounce = <T extends any>(
  callback: (args: T) => void,
  delay: number
) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  return (args: T) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      callback(args);
    }, delay);
  };
};