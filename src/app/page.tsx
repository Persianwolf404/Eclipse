"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Crosshair from "@/shared/components/Crosshair";
import Hero from "@/shared/components/Hero";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
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
      <Hero />
      <Crosshair />

    </div>
  );
}
