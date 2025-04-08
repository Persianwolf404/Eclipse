"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Crosshair from "@/components/Crosshair";
import { useCrosshairStore } from "@/components/Crosshair";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function createTextScrambleEffect(
  element: HTMLHeadingElement | null
): () => void {
  if (!element || !element.dataset.value) return () => {};

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let iteration = 0;
  let intervalId: NodeJS.Timeout | null = null;

  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    const originalText = element.dataset.value as string;

    element.innerText = originalText
      .split("")
      .map((_, index) => {
        if (index < iteration) {
          return originalText[index];
        }
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("");

    if (iteration >= originalText.length) {
      if (intervalId) clearInterval(intervalId);
    }

    iteration += 1 / 3;
  }, 30);

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}

export default function Home() {
  const { setCollapsed, setCursorText } = useCrosshairStore();

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const handleMouseEnter = () => {
      createTextScrambleEffect(titleElement);
      setCollapsed(!useCrosshairStore.getState().isCollapsed);
      setCursorText("click to start the magic!!!");
    };

    const handleMouseLeave = () => {
      setCollapsed(!useCrosshairStore.getState().isCollapsed);
      setCursorText("");
    };

    titleElement.addEventListener("mouseenter", handleMouseEnter);
    titleElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      titleElement.removeEventListener("mouseenter", handleMouseEnter);
      titleElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [setCollapsed, setCursorText]);

  useEffect(() => {
    let isActive = true;

    const animateTextPeriodically = async () => {
      while (isActive && titleRef.current) {
        createTextScrambleEffect(titleRef.current);
        await delay(4000);
      }
    };

    animateTextPeriodically();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const smoothScroll = new Lenis({
      wrapper: document.documentElement,
      content: document.body,
      wheelEventsTarget: window,
      eventsTarget: window,
      smoothWheel: true,
      syncTouch: false,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 55,
      duration: 1.7,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(1 - t, 4)),
      lerp: 0.1,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      touchMultiplier: 2,
      wheelMultiplier: 1,
      autoResize: true,
      __experimental__naiveDimensions: false,
    });

    let animationFrameId: number;

    function updateScroll(time: number) {
      smoothScroll.raf(time);
      animationFrameId = requestAnimationFrame(updateScroll);
    }

    animationFrameId = requestAnimationFrame(updateScroll);

    return () => {
      smoothScroll.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative h-screem overflow-hidden bg-[#0d0101] flex flex-col">
      <div className="w-screen h-screen flex justify-center items-center">
        <div>
          <h1
            ref={titleRef}
            data-value="ECLIPSE"
            className="md:text-9xl text-center w-sm text-7xl font-bold text-[#E30504] md:w-lg"
          >
            ECLIPSE
          </h1>
        </div>
      </div>
      <Crosshair />
    </div>
  );
}
