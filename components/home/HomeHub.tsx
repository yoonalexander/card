"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SectionNav from "./SectionNav";
import SectionPanel, { getSectionTitle, type SectionId } from "./SectionPanel";
import SectionWindow from "./SectionWindow";
import StarField from "./StarField";

type OpenWindow = {
  id: SectionId;
  x: number;
  y: number;
  z: number;
  isClosing?: boolean;
};

const defaultPositions: Record<SectionId, { x: number; y: number }> = {
  about: { x: 96, y: 96 },
  links: { x: 160, y: 132 },
  work: { x: 224, y: 168 },
  projects: { x: 288, y: 92 },
  faq: { x: 352, y: 148 },
  contact: { x: 416, y: 36 },
};

export default function HomeHub() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [savedPositions, setSavedPositions] = useState<Partial<Record<SectionId, { x: number; y: number }>>>({});
  const topZ = useRef(20);
  const [isDark, setIsDark] = useState(false);

  const openSectionIds = useMemo(() => openWindows.map((sectionWindow) => sectionWindow.id), [openWindows]);

  useEffect(() => {
    const root = document.documentElement;
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = saved ? saved === "dark" : prefersDark;

    root.classList.toggle("dark", shouldUseDark);
    document.body.classList.toggle("dark", shouldUseDark);
    root.setAttribute("data-theme", shouldUseDark ? "dark" : "light");
    setIsDark(shouldUseDark);
  }, []);

  function nextZIndex() {
    topZ.current += 1;
    return topZ.current;
  }

  function openSection(sectionId: SectionId) {
    const nextZ = nextZIndex();
    setOpenWindows((currentWindows) => {
      if (currentWindows.some((sectionWindow) => sectionWindow.id === sectionId)) {
        return currentWindows.map((sectionWindow) =>
          sectionWindow.id === sectionId ? { ...sectionWindow, z: nextZ } : sectionWindow,
        );
      }

      const position = savedPositions[sectionId] ?? getInitialPosition(sectionId);
      return [...currentWindows, { id: sectionId, x: position.x, y: position.y, z: nextZ }];
    });
  }

  function closeSection(sectionId: SectionId) {
    setOpenWindows((currentWindows) =>
      currentWindows.map((sectionWindow) =>
        sectionWindow.id === sectionId ? { ...sectionWindow, isClosing: true } : sectionWindow,
      ),
    );
  }

  function removeSection(sectionId: SectionId) {
    setOpenWindows((currentWindows) => currentWindows.filter((sectionWindow) => sectionWindow.id !== sectionId));
  }

  function focusSection(sectionId: SectionId) {
    const nextZ = nextZIndex();
    setOpenWindows((currentWindows) =>
      currentWindows.map((sectionWindow) =>
        sectionWindow.id === sectionId ? { ...sectionWindow, z: nextZ } : sectionWindow,
      ),
    );
  }

  function moveSection(sectionId: SectionId, position: { x: number; y: number }) {
    setSavedPositions((currentPositions) => ({
      ...currentPositions,
      [sectionId]: position,
    }));
    setOpenWindows((currentWindows) =>
      currentWindows.map((sectionWindow) =>
        sectionWindow.id === sectionId ? { ...sectionWindow, ...position } : sectionWindow,
      ),
    );
  }

  function toggleTheme() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextIsDark);
    document.body.classList.toggle("dark", nextIsDark);
    root.setAttribute("data-theme", nextIsDark ? "dark" : "light");
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  }

  return (
    <main className="container">
      <StarField isActive={isDark} />

      <div className="cloud-field" aria-hidden="true">
        {[0, 1, 2, 3].map((cloud) => (
          <div className={`cloud cloud-${cloud + 1}`} key={cloud}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>

      <button className="toggle-btn" type="button" onClick={toggleTheme} aria-label="Toggle Dark Mode">
        {isDark ? "🌙" : "☀️"}
      </button>

      <div className="card">
        <section className="home-intro" aria-label="Home introduction">
          <h1>
            hi! <span>i&apos;m alex</span>
          </h1>
          <p>matcha fueled software engineer</p>
        </section>

        <SectionNav openSections={openSectionIds} onOpen={openSection} />
      </div>

      {openWindows.map((sectionWindow) => (
        <SectionWindow
          key={sectionWindow.id}
          title={getSectionTitle(sectionWindow.id)}
          sectionId={sectionWindow.id}
          isClosing={sectionWindow.isClosing}
          position={{ x: sectionWindow.x, y: sectionWindow.y }}
          zIndex={sectionWindow.z}
          onClose={() => closeSection(sectionWindow.id)}
          onClosed={() => removeSection(sectionWindow.id)}
          onFocus={() => focusSection(sectionWindow.id)}
          onMove={(position) => moveSection(sectionWindow.id, position)}
        >
          <SectionPanel sectionId={sectionWindow.id} />
        </SectionWindow>
      ))}
    </main>
  );
}

function getInitialPosition(sectionId: SectionId) {
  const fallback = defaultPositions[sectionId];

  if (typeof window === "undefined") {
    return fallback;
  }

  return {
    x: Math.min(fallback.x, Math.max(16, window.innerWidth - 540)),
    y: Math.min(fallback.y, Math.max(72, window.innerHeight - 460)),
  };
}
