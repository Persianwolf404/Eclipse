import React, { useRef, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  maxTilt?: number; // degrees
  global?: boolean; // whether it listens globally or just on hover
  sensitivity?: number; // how much it tilts
    reverse?: boolean; // if true, reverse the tilt direction
  
};

const Tilt: React.FC<Props> = ({
  children,
  maxTilt = 5,
  global = false,
  sensitivity = 1,
  reverse = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const applyTilt = (
      x: number,
      y: number,
      bounds:
        | DOMRect
        | { width: number; height: number; left: number; top: number }
    ) => {
      if (!ref.current) return;

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const deltaX = x - centerX;
      const deltaY = y - centerY;

      const percentX = (deltaX / (bounds.width / 2)) * sensitivity;
      const percentY = (deltaY / (bounds.height / 2)) * sensitivity;

      const direction = reverse ? -1 : 1;

      const rotateX = percentY * -maxTilt * direction;
      const rotateY = percentX * maxTilt * direction;

      ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const resetTilt = () => {
      if (ref.current) {
        ref.current.style.transform = "rotateX(0deg) rotateY(0deg)";
      }
    };

    const handleGlobalMove = (e: MouseEvent) => {
      const bounds = target.getBoundingClientRect();
      applyTilt(e.clientX, e.clientY, bounds);
    };

    const handleLocalMove = (e: MouseEvent) => {
      const bounds = target.getBoundingClientRect();
      applyTilt(e.clientX, e.clientY, bounds);
    };

    if (global) {
      window.addEventListener("mousemove", handleGlobalMove);
      return () => {
        window.removeEventListener("mousemove", handleGlobalMove);
      };
    } else {
      target.addEventListener("mousemove", handleLocalMove);
      target.addEventListener("mouseleave", resetTilt);
      return () => {
        target.removeEventListener("mousemove", handleLocalMove);
        target.removeEventListener("mouseleave", resetTilt);
      };
    }
  }, [global, maxTilt, sensitivity, reverse]);

  return (
    <div
      ref={ref}
      style={{
        transition: "transform 0.2s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

export default Tilt;
