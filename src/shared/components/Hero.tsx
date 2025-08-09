import React, { useEffect, useRef, useState } from "react";
import { delay } from "../utils";
import { useCrosshairStore } from "./Crosshair";
import { useTextScramble } from "../animations/scramble";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";


export default function Hero() {
  const { setCollapsed, setCursorText, setProgressPercentage } =
    useCrosshairStore();

  const containerRef = useRef(null);
  const blobContainerRef = useRef(null);
  const blobRef = useRef(null);
  // const containerRef = useRef(null);
  // const containerRef = useRef(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scramble } = useTextScramble();

  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const handleMouseEnter = () => {
      setCollapsed(true);
      scramble(titleRef.current, "ECLIPSE");
      setCursorText("click to start the magic!!!");
    };

    const handleMouseLeave = () => {
      setCursorText("");

      if (useCrosshairStore.getState().progressPercentage != 0) return;
      setCollapsed(false);
    };

    const handleMouseClick = async () => {
      setCollapsed(true);
      setProgressPercentage(100);
      await delay(1000);
      setProgressPercentage(0);
      setCollapsed(false);
    };

    titleElement.addEventListener("click", handleMouseClick);
    titleElement.addEventListener("mouseenter", handleMouseEnter);
    titleElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      titleElement.removeEventListener("mouseenter", handleMouseEnter);
      titleElement.removeEventListener("mouseleave", handleMouseLeave);
      titleElement.removeEventListener("click", handleMouseClick);
    };
  }, [scramble, setCollapsed, setCursorText, setProgressPercentage]);

  useEffect(() => {
    let isActive = true;
    const animateTextPeriodically = async () => {
      while (isActive && titleRef.current) {
        scramble(titleRef.current, "ECLIPSE");
        await delay(4000);
      }
    };

    animateTextPeriodically();

    return () => {
      isActive = false;
    };
  }, [scramble]);
  const [trigger, setTrigger] = useState(false);

  useGSAP(() => {
    if (trigger) {
      // gsap.to(containerRef.current, {
      //   height: "auto",
      // });

      const blobContainer = blobContainerRef.current;
      const blob = blobRef.current;
      const tl = gsap.timeline();

      tl.to(blobContainer, {
        display: "flex", // No delay needed here — it's instant
      })
        .to(blob, {
          rotateY: "0",
          ease: "expo.out",
          duration: 1.6,
          delay: 0.4, // ✅ only this delay is intentional
        })
        .to(
          blob,
          {
            width: "200%",
            height: "200vh",
            duration: 0.6,
          },
          "-=1.2"
        ) // ⬅️ Starts 0.1s before the rotate ends — smoother flow
        .to(
          blob,
          {
            borderRadius: "0",
          },
          "-=1.15"
        );
    }
  }, [trigger]);

  return (
    <section ref={containerRef} className="h-creen relative">
      <div className="w-screen overflow-hidden relative h-screen flex justify-center items-center">
        <div>
          <h1
            ref={titleRef}
            data-value="ECLIPSE"
            className="md:text-9xl text-center w-sm text-7xl font-bold text-[#E30504] md:w-lg"
            onClick={() => {
              if (!trigger) setTrigger(true);
            }}
          >
            ECLIPSE
          </h1>
        </div>
      </div>
      <div>
        <div
          ref={blobContainerRef}
          className="absolute w-full h-screen z-40 top-0 justify-center items-center hidden"
        >
          <div
            ref={blobRef}
            style={{
              borderRadius: "100% 58% 67% 100% / 68% 85% 63% 100%",
            }}
            className="relative w-96 h-96 flex rotate-y-90 items-center justify-center overflow-hidden"
          >
            <div
              style={{
                backgroundImage: 'url("./images/eclipse.avif")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="absolute w-full h-screen z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            <div className="z-10 w-full h-screen inset-0 backdrop-blur-md bg-black/50  flex items-center justify-center"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
