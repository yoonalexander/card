"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  left: string;
  top: string;
  dimension: string;
  opacityValue: number;
  animationDelayValue: string;
};

type PointerPosition = {
  x: number;
  y: number;
} | null;

type ViewportSize = {
  width: number;
  height: number;
};

const starCount = 120;
const repelRadius = 118;
const repelStrength = 34;

export default function StarField({ isActive }: { isActive: boolean }) {
  const frame = useRef<number | null>(null);
  const pointerRef = useRef<PointerPosition>(null);
  const [pointer, setPointer] = useState<PointerPosition>(null);
  const [viewport, setViewport] = useState<ViewportSize>({ width: 0, height: 0 });

  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, index) => {
      const xSeed = Math.sin(index * 12.9898) * 43758.5453;
      const ySeed = Math.sin(index * 78.233) * 24634.6345;
      const sizeSeed = Math.sin(index * 37.719) * 13257.1349;
      const opacitySeed = Math.sin(index * 19.413) * 9137.2384;

      const x = round(fractional(xSeed) * 96 + 2, 4);
      const y = round(fractional(ySeed) * 48 + 2, 4);
      const size = round(fractional(sizeSeed) * 2 + 1, 3);
      const opacity = round(fractional(opacitySeed) * 0.42 + 0.58, 3);
      const twinkleDelay = round(fractional(xSeed + ySeed) * -4, 3);

      return {
        id: index,
        x,
        y,
        size,
        opacity,
        twinkleDelay,
        left: `${x}%`,
        top: `${y}vh`,
        dimension: `${size}px`,
        opacityValue: opacity,
        animationDelayValue: `${twinkleDelay}s`,
      };
    });
  }, []);

  useEffect(() => {
    function updateViewport() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setPointer(null);
      pointerRef.current = null;
      return;
    }

    function updatePointer(event: PointerEvent) {
      pointerRef.current = { x: event.clientX, y: event.clientY };

      if (frame.current === null) {
        frame.current = window.requestAnimationFrame(() => {
          setPointer(pointerRef.current);
          frame.current = null;
        });
      }
    }

    function clearPointer() {
      pointerRef.current = null;
      setPointer(null);
    }

    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("pointerleave", clearPointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);

      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, [isActive]);

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => {
        const starX = (star.x / 100) * viewport.width;
        const starY = (star.y / 100) * viewport.height;
        const offset = getRepelOffset(pointer, starX, starY);

        return (
          <span
            className="star"
            key={star.id}
            style={{
              left: star.left,
              top: star.top,
              width: star.dimension,
              height: star.dimension,
              opacity: star.opacityValue,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              animationDelay: star.animationDelayValue,
            }}
          />
        );
      })}
    </div>
  );
}

function getRepelOffset(pointer: PointerPosition, starX: number, starY: number) {
  if (!pointer) {
    return { x: 0, y: 0 };
  }

  const dx = starX - pointer.x;
  const dy = starY - pointer.y;
  const distance = Math.hypot(dx, dy);

  if (distance === 0 || distance > repelRadius) {
    return { x: 0, y: 0 };
  }

  const force = (1 - distance / repelRadius) * repelStrength;

  return {
    x: (dx / distance) * force,
    y: (dy / distance) * force,
  };
}

function fractional(value: number) {
  return value - Math.floor(value);
}

function round(value: number, precision: number) {
  return Number(value.toFixed(precision));
}
