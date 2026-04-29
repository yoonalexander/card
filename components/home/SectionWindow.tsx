"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";

type Position = {
  x: number;
  y: number;
};

type SectionWindowProps = {
  title: string;
  sectionId?: string;
  isClosing?: boolean;
  position: Position;
  zIndex: number;
  onClose: () => void;
  onClosed: () => void;
  onFocus: () => void;
  onMove: (position: Position) => void;
  children: ReactNode;
};

export default function SectionWindow({
  title,
  sectionId,
  isClosing = false,
  position,
  zIndex,
  onClose,
  onClosed,
  onFocus,
  onMove,
  children,
}: SectionWindowProps) {
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    event.stopPropagation();
    onFocus();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const node = windowRef.current;
    const width = node?.offsetWidth ?? 520;
    const height = node?.offsetHeight ?? 420;
    const maxX = Math.max(12, window.innerWidth - width - 12);
    const maxY = Math.max(12, window.innerHeight - height - 12);

    onMove({
      x: clamp(event.clientX - dragOffset.current.x, 12, maxX),
      y: clamp(event.clientY - dragOffset.current.y, 12, maxY),
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      className={`section-window${sectionId ? ` section-window-${sectionId}` : ""}${
        isClosing ? " section-window-closing" : ""
      }`}
      ref={windowRef}
      style={{ left: position.x, top: position.y, zIndex }}
      onPointerDown={onFocus}
      onAnimationEnd={() => {
        if (isClosing) onClosed();
      }}
      aria-label={`${title} window`}
    >
      <div
        className="section-window-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <h2 className="section-window-title">{title}</h2>
        <button
          className="section-window-close"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label={`Close ${title}`}
        >
          x
        </button>
      </div>
      <div className="section-window-content">{children}</div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
