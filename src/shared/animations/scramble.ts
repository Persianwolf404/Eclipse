// useTextScramble.ts
"use client";

import { useRef } from "react";

interface ScrambleOptions {
  characters?: string;
  speed?: number;
  delay?: number;
}

export function useTextScramble() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = (
    element: HTMLElement | null,
    text: string,
    options: ScrambleOptions = {}
  ) => {
    if (!element) return () => {};

    const {
      characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      speed = 1 / 3,
      delay = 30,
    } = options;

    let iteration = 0;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      element.innerText = text
        .split("")
        .map((_, index) => {
          if (index < iteration) {
            return text[index];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join("");

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += speed;
    }, delay);

    // Return cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  return { scramble };
}
