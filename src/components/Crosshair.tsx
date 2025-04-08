"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Crosshair from "../../public/images/crosshair.png";
import { create } from "zustand";
import { createTextTransitionAnimation, setupCursorBlinking } from "@/animations/typing";


interface CrosshairStore {
  isCollapsed: boolean;
  cursorText: string;
  progressPercentage: number;
  setCollapsed: (collapsed: boolean) => void;
  setCursorText: (text: string) => void;
  setProgressPercentage: (percentage: number) => void;
}

export const useCrosshairStore = create<CrosshairStore>((set) => ({
  isCollapsed: false,
  cursorText: "",
  progressPercentage: 0,
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  setCursorText: (text) => set({ cursorText: text }),
  setProgressPercentage: (percentage) =>
    set({ progressPercentage: percentage }),
}));

export default function CrosshairCursor() {
  const crosshairIconRef = useRef<HTMLSpanElement>(null);
  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const crosshairTitleRef = useRef<HTMLDivElement>(null);
  const textSpanRef = useRef<HTMLSpanElement>(null);
  const crosshairContainerRef = useRef<HTMLDivElement>(null);
  const circleContainerRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const { isCollapsed, cursorText, progressPercentage } = useCrosshairStore();
  const prevTextRef = useRef<string>("");
  const typingAnimationRef = useRef<gsap.core.Timeline | null>(null);

  const collapseCrosshair = () => {
    gsap.to(circleContainerRef.current, {
      gap: "0",
      marginLeft: "8px",
      duration: 0.3,
    });
  };

  const expandCrosshair = () => {
    gsap.to(circleContainerRef.current, {
      gap: "1rem",
      marginLeft: "0",
      duration: 0.3,
    });
  };

  // Watch for changes in the collapsed state
  useEffect(() => {
    if (isCollapsed) {
      collapseCrosshair();
    } else {
      expandCrosshair();
    }
  }, [isCollapsed]);

  // Init cursor blink animation once on mount
  useEffect(() => {
    if (cursorRef.current) {
      setupCursorBlinking(cursorRef.current);
    }
  }, []);

  // Animate text typing effect when cursorText changes
  useEffect(() => {
    if (textSpanRef.current && cursorText !== prevTextRef.current) {
      // Kill any ongoing animations for clean slate
      if (typingAnimationRef.current) {
        typingAnimationRef.current.kill();
      }

      // Create text transition animation
      typingAnimationRef.current = createTextTransitionAnimation(
        textSpanRef.current,
        prevTextRef.current,
        cursorText,
        {
          cursorElement: cursorRef.current,
        }
      );

      // Store current text for next comparison
      prevTextRef.current = cursorText;
    }
  }, [cursorText]);

  // Animate circular progress bar
  useEffect(() => {
    if (progressCircleRef.current) {
      const circumference = 2 * Math.PI * 30;
      const offset = circumference - (progressPercentage / 100) * circumference;
      gsap.to(progressCircleRef.current, {
        strokeDashoffset: offset,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [progressPercentage]);

  useEffect(() => {
    let animationFrameId: number;
    let wrapperPosX = 0;
    let wrapperPosY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const updateCursorPosition = () => {
      if (crosshairIconRef.current) {
        crosshairIconRef.current.style.left = `${mouseX - 18}px`;
        crosshairIconRef.current.style.top = `${mouseY - 18}px`;
      }
      if (cursorWrapperRef.current) {
        const targetX = mouseX - 80;
        const targetY = mouseY - 33;
        const easingFactor = 0.1;
        wrapperPosX += (targetX - wrapperPosX) * easingFactor;
        wrapperPosY += (targetY - wrapperPosY) * easingFactor;
        cursorWrapperRef.current.style.left = `${wrapperPosX}px`;
        cursorWrapperRef.current.style.top = `${wrapperPosY}px`;
        animationFrameId = requestAnimationFrame(updateCursorPosition);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX = clientX;
      mouseY = clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateCursorPosition);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useGSAP(() => {
    gsap.to(crosshairContainerRef.current, {
      delay: 0.1,
      visibility: "visible",
    });
    gsap.from(cursorWrapperRef.current, {
      scale: 0.5,
      delay: 1,
      duration: 0.5,
      opacity: 0,
    });
  }, []);

  return (
    <div ref={crosshairContainerRef} className="invisible">
      <div className="pointer-events-none absolute top-0 left-0 z-50">
        <div ref={cursorWrapperRef} className="ml-10 flex flex-col fixed">
          <div
            ref={circleContainerRef}
            className="gap-4 flex relative items-center justify-center"
          >
            <div className="w-[37px] h-[73px] border border-gray-500 border-r-0 rounded-l-full bg-transparent"></div>
            <div className="w-[37px] h-[73px] border border-gray-500 border-l-0 rounded-r-full bg-transparent"></div>
            <svg className="absolute w-[108px] h-[108px]" viewBox="0 0 100 100">
              <circle
                ref={progressCircleRef}
                className="stroke-white"
                cx="50"
                cy="50"
                r="30"
                fill="none"
                strokeWidth="2"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div
            ref={crosshairTitleRef}
            className="text-gray-400 font-light mt-1 text-center relative overflow-visible"
          >
            <div className="absolute mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap flex items-center">
              <span ref={textSpanRef} className="opacity-0"></span>
              <span
                ref={cursorRef}
                className="text-white ml-1 inline-block w-[1px] h-[16px] bg-white"
              />
            </div>
            <span className="invisible">.</span>
          </div>
        </div>
      </div>
      <span ref={crosshairIconRef} className="fixed pointer-events-none">
        <Image src={Crosshair} width={45} height={45} alt="crosshair" />
      </span>
    </div>
  );
}
