"use client";

import { type CSSProperties, type AnimationEvent, useEffect, useRef, useState } from "react";
import FlowerGraphic from "./FlowerGraphic";

type FlowerResponse = {
  flowers: number;
};

type PlantedFlower = {
  id: number;
  left: number;
  bottom: number;
  scale: number;
  tilt: number;
  petal: string;
  outline: string;
  center: string;
};

type FlowerStyle = CSSProperties & {
  "--flower-left": string;
  "--flower-bottom": string;
  "--flower-scale": number;
  "--flower-tilt": string;
  "--flower-petal": string;
  "--flower-outline": string;
  "--flower-center": string;
};

const DEFAULT_RATE_LIMIT_DURATION = 3000;

type FlowerCounterProps = {
  isDark: boolean;
};

const flowerPalette = [
  { petal: "#f2a5bf", outline: "#bd718c", center: "#f7d97a" },
  { petal: "#f4cf68", outline: "#c49b2f", center: "#f28e7f" },
  { petal: "#b7a2e5", outline: "#8069b8", center: "#f7d97a" },
  { petal: "#f28e7f", outline: "#b95f55", center: "#fff4d6" },
  { petal: "#7fb8ff", outline: "#4d82c4", center: "#f7d97a" },
  { petal: "#4f9f63", outline: "#2f6e43", center: "#fff4d6" },
  { petal: "#bde8a1", outline: "#74ad64", center: "#f2a5bf" },
  { petal: "#fffdf7", outline: "#b8c1b7", center: "#f4cf68" },
  { petal: "#252525", outline: "#050505", center: "#f2a5bf" },
] as const;

export default function FlowerCounter({ isDark }: FlowerCounterProps) {
  const [flowers, setFlowers] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [plantedFlowers, setPlantedFlowers] = useState<PlantedFlower[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const requestQueueRef = useRef<PlantedFlower[]>([]);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  const nextFlowerIdRef = useRef(0);
  const rateLimitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    let isActive = true;
    const controller = new AbortController();

    async function loadFlowers() {
      try {
        const response = await fetch("/api/flowers", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await readFlowerResponse(response);

        if (isActive) {
          setFlowers(data.flowers);
        }
      } catch (error) {
        if (isActive && !(error instanceof DOMException && error.name === "AbortError")) {
          setStatusMessage("the shared flower count is temporarily unavailable");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadFlowers();

    return () => {
      isActive = false;
      isMountedRef.current = false;
      requestQueueRef.current = [];
      if (rateLimitTimerRef.current !== null) {
        window.clearTimeout(rateLimitTimerRef.current);
      }
      controller.abort();
    };
  }, []);

  function handleFlowerClick() {
    if (isRateLimited) return;

    const plantedFlower = createPlantedFlower(++nextFlowerIdRef.current);

    setStatusMessage("planting a flower");
    setIsAnimating(false);
    window.requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setIsAnimating(true);
      }
    });

    requestQueueRef.current.push(plantedFlower);
    void processFlowerQueue();
  }

  async function processFlowerQueue() {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    while (requestQueueRef.current.length > 0) {
      const plantedFlower = requestQueueRef.current[0];

      try {
        const response = await fetch("/api/flowers", {
          method: "POST",
          cache: "no-store",
        });
        const data = await readFlowerResponse(response);

        requestQueueRef.current.shift();

        if (isMountedRef.current) {
          setFlowers(data.flowers);
          setPlantedFlowers((currentFlowers) => [...currentFlowers, plantedFlower]);
          setStatusMessage("flower planted");
        }
      } catch (error) {
        requestQueueRef.current.shift();
        requestQueueRef.current = [];

        if (isMountedRef.current) {
          if (error instanceof FlowerRequestError && error.status === 429) {
            showRateLimitMessage(error.retryAfterMs);
          } else {
            setStatusMessage("the flower could not be planted");
          }
        }

        break;
      }
    }

    isProcessingRef.current = false;
  }

  function showRateLimitMessage(duration: number) {
    if (rateLimitTimerRef.current !== null) {
      window.clearTimeout(rateLimitTimerRef.current);
    }

    setIsRateLimited(true);
    setStatusMessage("whoa, buddy, slow down");
    rateLimitTimerRef.current = window.setTimeout(() => {
      if (isMountedRef.current) {
        setIsRateLimited(false);
        setStatusMessage("you can plant flowers again");
      }
      rateLimitTimerRef.current = null;
    }, duration);
  }

  function handleAnimationEnd(event: AnimationEvent<HTMLButtonElement>) {
    if (event.currentTarget === event.target) {
      setIsAnimating(false);
    }
  }

  return (
    <>
      <div className="hill-flower-field" aria-hidden="true">
        {plantedFlowers.map((flower) => {
          const style: FlowerStyle = {
            "--flower-left": `${flower.left}%`,
            "--flower-bottom": `${flower.bottom}vh`,
            "--flower-scale": flower.scale,
            "--flower-tilt": `${flower.tilt}deg`,
            "--flower-petal": flower.petal,
            "--flower-outline": flower.outline,
            "--flower-center": flower.center,
          };

          return (
            <span className="hill-flower" style={style} key={flower.id}>
              <FlowerGraphic />
            </span>
          );
        })}
      </div>

      <button
        className={`flower-counter${isAnimating ? " flower-counter-animating" : ""}`}
        type="button"
        onClick={handleFlowerClick}
        onAnimationEnd={handleAnimationEnd}
        disabled={isLoading || isRateLimited}
        aria-label={
          isLoading
            ? "loading shared flower count"
            : isRateLimited
              ? `flower counter cooling down, ${flowers} planted globally`
              : `plant a flower, ${flowers} planted globally`
        }
      >
        <span className="flower-counter-icon" aria-hidden="true">
          <img
            src={`/assets/icons/flower-counter-${isDark ? "white" : "black"}.svg`}
            alt=""
          />
        </span>
        <span className="flower-counter-value">{isLoading ? "..." : flowers.toLocaleString()}</span>
      </button>
      <span
        className={`flower-rate-limit-message${isRateLimited ? " flower-rate-limit-message-visible" : ""}`}
        aria-hidden={!isRateLimited}
      >
        whoa, buddy, slow down.
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </span>
    </>
  );
}

async function readFlowerResponse(response: Response): Promise<FlowerResponse> {
  if (!response.ok) {
    throw new FlowerRequestError(response.status, getRetryAfterMs(response.headers.get("Retry-After")));
  }

  const data = (await response.json()) as Partial<FlowerResponse>;
  if (!Number.isSafeInteger(data.flowers) || (data.flowers ?? -1) < 0) {
    throw new Error("Flower response did not contain a valid count");
  }

  return { flowers: data.flowers as number };
}

function createPlantedFlower(id: number): PlantedFlower {
  const isNarrowScreen = window.innerWidth <= 720;
  const zone = Math.random();
  let left: number;
  let bottom: number;

  if (isNarrowScreen) {
    left = randomBetween(7, 93);
    bottom = randomBetween(9, 23);
  } else if (zone < 0.4) {
    left = randomBetween(5, 27);
    bottom = randomBetween(9, 32);
  } else if (zone < 0.8) {
    left = randomBetween(73, 95);
    bottom = randomBetween(9, 32);
  } else {
    left = randomBetween(30, 70);
    bottom = randomBetween(10, 19);
  }

  const palette = flowerPalette[Math.floor(Math.random() * flowerPalette.length)];

  return {
    id,
    left,
    bottom,
    scale: randomBetween(0.62, 1.08),
    tilt: randomBetween(-5, 5),
    petal: palette.petal,
    outline: palette.outline,
    center: palette.center,
  };
}

function getRetryAfterMs(retryAfter: string | null) {
  if (!retryAfter) return DEFAULT_RATE_LIMIT_DURATION;

  const numericRetryAfter = Number.parseFloat(retryAfter);
  if (Number.isFinite(numericRetryAfter) && numericRetryAfter > 0) {
    const milliseconds = numericRetryAfter <= 10 ? numericRetryAfter * 1000 : numericRetryAfter;
    return Math.min(10_000, Math.max(1800, milliseconds));
  }

  return DEFAULT_RATE_LIMIT_DURATION;
}

class FlowerRequestError extends Error {
  constructor(
    readonly status: number,
    readonly retryAfterMs: number,
  ) {
    super(`Flower request failed with ${status}`);
    this.name = "FlowerRequestError";
  }
}

function randomBetween(minimum: number, maximum: number) {
  return Math.round((minimum + Math.random() * (maximum - minimum)) * 100) / 100;
}
