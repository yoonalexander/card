"use client";

import { type MouseEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import SectionNav from "./SectionNav";
import SectionPanel, { getSectionTitle, type SectionId } from "./SectionPanel";
import SectionWindow from "./SectionWindow";
import StarField from "./StarField";

type OpenWindow = {
  id: WindowId;
  x: number;
  y: number;
  z: number;
  isClosing?: boolean;
};

type DemoWindowId = "pocket-ai-demo";
type WindowId = SectionId | DemoWindowId;

const defaultPositions: Record<WindowId, { x: number; y: number }> = {
  about: { x: 96, y: 96 },
  links: { x: 160, y: 132 },
  work: { x: 224, y: 168 },
  projects: { x: 288, y: 92 },
  faq: { x: 352, y: 148 },
  contact: { x: 416, y: 36 },
  "pocket-ai-demo": { x: 260, y: 96 },
};

const estimatedWindowWidths: Partial<Record<WindowId, number>> = {
  about: 720,
  work: 900,
  projects: 1500,
  contact: 640,
  "pocket-ai-demo": 900,
};

const soundSources = {
  click: "/assets/sounds/click.mp3",
  closeWindow: "/assets/sounds/close_window.mp3",
  lightMode: "/assets/sounds/light_mode_toggle.mp3",
  nightMode: "/assets/sounds/night_mode_toggle.mp3",
  soundToggle: "/assets/sounds/sound_toggle.mp3",
} as const;

const soundVolumes: Record<keyof typeof soundSources, number> = {
  click: 1,
  closeWindow: 1,
  lightMode: 0.8,
  nightMode: 0.8,
  soundToggle: 0.28,
};

const heroLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yoonalex/", icon: "/assets/icons/linkedin-logo.png" },
  { label: "GitHub", href: "https://github.com/yoonalexander", icon: "/assets/icons/github-logo.png" },
  { label: "Resume", href: "/assets/files/Alexander_Yoon_Resume_DA_2026.pdf", icon: "/assets/icons/work.png" },
] as const;

const heroDescriptors = [
  "matcha fueled",
  "volleyball addicted",
  "thrifting enthusiast",
  "gym rat",
  "morning runner",
  "bug squashing",
  "game dev hobbyist",
  "AI curious",
  "ML passionate",
  "manga reading",
  "anime bingeing",
  "foodie",
] as const;

const typewriterConfig = {
  typingSpeed: 82,
  deletingSpeed: 46,
  pauseDuration: 8000,
};

type SoundName = keyof typeof soundSources;

export default function HomeHub() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [savedPositions, setSavedPositions] = useState<Partial<Record<WindowId, { x: number; y: number }>>>({});
  const topZ = useRef(20);
  const audioRefs = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({});
  const isAudioUnlockedRef = useRef(false);
  const isSoundOnRef = useRef(true);
  const [isDark, setIsDark] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const openSectionIds = useMemo(
    () =>
      openWindows.reduce<SectionId[]>((sectionIds, sectionWindow) => {
        if (isSectionId(sectionWindow.id)) {
          sectionIds.push(sectionWindow.id);
        }

        return sectionIds;
      }, []),
    [openWindows],
  );

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

  useEffect(() => {
    const savedSound = window.localStorage.getItem("sound");
    setIsSoundOn(savedSound ? savedSound === "on" : true);
  }, []);

  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
  }, [isSoundOn]);

  useEffect(() => {
    audioRefs.current = Object.fromEntries(
      Object.entries(soundSources).map(([name, src]) => {
        const audio = new Audio(src);
        audio.preload = "auto";
        return [name, audio];
      }),
    ) as Partial<Record<SoundName, HTMLAudioElement>>;
  }, []);

  function nextZIndex() {
    topZ.current += 1;
    return topZ.current;
  }

  function openSection(sectionId: SectionId) {
    openWindow(sectionId);
  }

  function openProjectDemo(projectName: string) {
    if (projectName === "Pocket AI") {
      openWindow("pocket-ai-demo");
    }
  }

  function openWindow(windowId: WindowId) {
    const nextZ = nextZIndex();
    setOpenWindows((currentWindows) => {
      if (currentWindows.some((sectionWindow) => sectionWindow.id === windowId)) {
        return currentWindows.map((sectionWindow) =>
          sectionWindow.id === windowId ? { ...sectionWindow, z: nextZ } : sectionWindow,
        );
      }

      const position = savedPositions[windowId] ?? getInitialPosition(windowId);
      return [...currentWindows, { id: windowId, x: position.x, y: position.y, z: nextZ }];
    });
  }

  function closeWindow(windowId: WindowId) {
    setOpenWindows((currentWindows) =>
      currentWindows.map((sectionWindow) =>
        sectionWindow.id === windowId ? { ...sectionWindow, isClosing: true } : sectionWindow,
      ),
    );
  }

  function removeWindow(windowId: WindowId) {
    setOpenWindows((currentWindows) => currentWindows.filter((sectionWindow) => sectionWindow.id !== windowId));
  }

  function focusWindow(windowId: WindowId) {
    const nextZ = nextZIndex();
    setOpenWindows((currentWindows) =>
      currentWindows.map((sectionWindow) =>
        sectionWindow.id === windowId ? { ...sectionWindow, z: nextZ } : sectionWindow,
      ),
    );
  }

  function moveWindow(windowId: WindowId, position: { x: number; y: number }) {
    setSavedPositions((currentPositions) => ({
      ...currentPositions,
      [windowId]: position,
    }));
    setOpenWindows((currentWindows) =>
      currentWindows.map((sectionWindow) =>
        sectionWindow.id === windowId ? { ...sectionWindow, ...position } : sectionWindow,
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

  function toggleSound() {
    setIsSoundOn((currentIsSoundOn) => {
      const nextIsSoundOn = !currentIsSoundOn;
      window.localStorage.setItem("sound", nextIsSoundOn ? "on" : "off");
      if (nextIsSoundOn) {
        playSound("soundToggle", { force: true });
      }
      return nextIsSoundOn;
    });
  }

  function playSound(soundName: SoundName, options: { force?: boolean } = {}) {
    if (!options.force && !isSoundOn) return;

    const audio = audioRefs.current[soundName];
    if (!audio) return;

    audio.volume = soundVolumes[soundName];
    audio.currentTime = 0;
    void audio
      .play()
      .then(() => {
        isAudioUnlockedRef.current = true;
      })
      .catch(() => {
        // Some browsers block audio until user interaction; later clicks can still play normally.
        isAudioUnlockedRef.current = false;
      });
  }

  function handleHubPointerDownCapture(event: PointerEvent<HTMLElement>) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !isSoundOnRef.current || isAudioUnlockedRef.current) return;

    if (target.closest("button, a, .faq-trigger")) return;

    const audio = audioRefs.current.click;
    if (!audio) return;

    audio.volume = soundVolumes.click;
    audio.currentTime = 0;
    void audio
      .play()
      .then(() => {
        isAudioUnlockedRef.current = true;
      })
      .catch(() => {
        isAudioUnlockedRef.current = false;
      });
  }

  function handleHubClickCapture(event: MouseEvent<HTMLElement>) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest(".volume-btn")) {
      return;
    }

    if (target.closest(".toggle-btn")) {
      const nextIsDark = !document.documentElement.classList.contains("dark");
      playSound(nextIsDark ? "nightMode" : "lightMode");
      return;
    }

    if (target.closest(".section-window-close")) {
      playSound("closeWindow");
      return;
    }

    if (target.closest(".faq-trigger")) {
      return;
    }

    if (target.closest("button, a")) {
      playSound("click");
    }
  }

  function handleHubPointerOver(event: MouseEvent<HTMLElement>) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const relatedTarget = event.relatedTarget instanceof Element ? event.relatedTarget : null;
    const hoverSoundTarget = getHoverSoundTarget(target);
    if (!hoverSoundTarget) return;

    if (relatedTarget && hoverSoundTarget.contains(relatedTarget)) return;

    playSound("click");
  }

  return (
    <main
      className="container"
      onPointerDownCapture={handleHubPointerDownCapture}
      onClickCapture={handleHubClickCapture}
      onMouseOver={handleHubPointerOver}
    >
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

      <button
        className="toggle-btn volume-btn"
        type="button"
        onClick={toggleSound}
        aria-label={isSoundOn ? "Turn sound off" : "Turn sound on"}
        aria-pressed={isSoundOn}
      >
        <img src={isSoundOn ? "/assets/icons/volume_on.png" : "/assets/icons/volume_off.png"} alt="" aria-hidden="true" />
      </button>

      <button className="toggle-btn" type="button" onClick={toggleTheme} aria-label="Toggle Dark Mode">
        {isDark ? "🌙" : "☀️"}
      </button>

      <div className="card">
        <section className="home-intro" aria-label="Home introduction">
          <h1>
            hi! <span>i&apos;m alex</span>
          </h1>
          <TypewriterText descriptors={heroDescriptors} staticText="software engineer" {...typewriterConfig} />
        </section>

        <SectionNav openSections={openSectionIds} onOpen={openSection} />
      </div>

      {openWindows.map((sectionWindow) => (
        <SectionWindow
          key={sectionWindow.id}
          title={getWindowTitle(sectionWindow.id)}
          sectionId={sectionWindow.id}
          isClosing={sectionWindow.isClosing}
          position={{ x: sectionWindow.x, y: sectionWindow.y }}
          zIndex={sectionWindow.z}
          onClose={() => closeWindow(sectionWindow.id)}
          onClosed={() => removeWindow(sectionWindow.id)}
          onFocus={() => focusWindow(sectionWindow.id)}
          onMove={(position) => moveWindow(sectionWindow.id, position)}
        >
          {isSectionId(sectionWindow.id) ? (
            <SectionPanel sectionId={sectionWindow.id} onOpenProjectDemo={openProjectDemo} />
          ) : (
            <PocketAIDemoWindow />
          )}
        </SectionWindow>
      ))}

      <div className="hero-link-row" aria-label="Featured links">
        {heroLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            <img src={link.icon} alt="" aria-hidden="true" />
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      <footer className="site-footer">© Alex Yoon 2026</footer>
    </main>
  );
}

function getHoverSoundTarget(target: Element) {
  return target.closest(".section-launcher, .hero-link-row a, .toggle-btn, .skill-chips span");
}

function getInitialPosition(windowId: WindowId) {
  const fallback = defaultPositions[windowId];

  if (typeof window === "undefined") {
    return fallback;
  }

  const estimatedWidth = Math.min(window.innerWidth * 0.96, estimatedWindowWidths[windowId] ?? 520);
  const preferredX =
    windowId === "projects" || windowId === "pocket-ai-demo" ? (window.innerWidth - estimatedWidth) / 2 : fallback.x;

  return {
    x: Math.min(Math.max(16, preferredX), Math.max(16, window.innerWidth - estimatedWidth - 16)),
    y: Math.min(fallback.y, Math.max(72, window.innerHeight - 460)),
  };
}

function getWindowTitle(windowId: WindowId) {
  if (windowId === "pocket-ai-demo") return "Pocket AI Demo";
  return getSectionTitle(windowId);
}

function isSectionId(windowId: WindowId): windowId is SectionId {
  return windowId !== "pocket-ai-demo";
}

type TypewriterTextProps = {
  descriptors: readonly string[];
  staticText: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
};

function TypewriterText({
  descriptors,
  staticText,
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseDuration = 2500,
}: TypewriterTextProps) {
  const firstDescriptor = descriptors[0] ?? "";
  const descriptorQueueRef = useRef<string[]>([]);
  const lastDescriptorRef = useRef(firstDescriptor);
  const [displayedText, setDisplayedText] = useState(firstDescriptor);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetDescriptor, setTargetDescriptor] = useState(firstDescriptor);

  useEffect(() => {
    if (descriptors.length <= 1) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) return;

    function getNextDescriptor() {
      if (descriptorQueueRef.current.length === 0) {
        descriptorQueueRef.current = shuffleDescriptors(descriptors.filter((descriptor) => descriptor !== firstDescriptor));
      }

      const nextDescriptor = descriptorQueueRef.current.shift() ?? firstDescriptor;
      if (nextDescriptor !== lastDescriptorRef.current) {
        return nextDescriptor;
      }

      const replacementDescriptor = descriptorQueueRef.current.shift();
      if (!replacementDescriptor) {
        descriptorQueueRef.current = shuffleDescriptors(
          descriptors.filter((descriptor) => descriptor !== lastDescriptorRef.current),
        );
        return descriptorQueueRef.current.shift() ?? firstDescriptor;
      }

      descriptorQueueRef.current.push(nextDescriptor);
      return replacementDescriptor;
    }

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting && displayedText === targetDescriptor) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && displayedText.length === 0) {
          const nextDescriptor = getNextDescriptor();
          lastDescriptorRef.current = nextDescriptor;
          setTargetDescriptor(nextDescriptor);
          setIsDeleting(false);
          return;
        }

        setDisplayedText((currentText) =>
          isDeleting
            ? currentText.slice(0, -1)
            : targetDescriptor.slice(0, Math.min(currentText.length + 1, targetDescriptor.length)),
        );
      },
      !isDeleting && displayedText === targetDescriptor
        ? pauseDuration
        : isDeleting
          ? deletingSpeed
          : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [deletingSpeed, descriptors, displayedText, firstDescriptor, isDeleting, pauseDuration, targetDescriptor, typingSpeed]);

  return (
    <p className="typewriter-line">
      <span className="typewriter-descriptor">{displayedText}</span>
      <span className="typewriter-cursor" aria-hidden="true" />
      <span className="typewriter-static">{staticText}</span>
    </p>
  );
}

function shuffleDescriptors(descriptors: readonly string[]) {
  const shuffledDescriptors = [...descriptors];

  for (let index = shuffledDescriptors.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledDescriptors[index], shuffledDescriptors[swapIndex]] = [
      shuffledDescriptors[swapIndex],
      shuffledDescriptors[index],
    ];
  }

  return shuffledDescriptors;
}

function PocketAIDemoWindow() {
  return (
    <div className="project-video-panel">
      <div className="project-phone-demo" aria-label="Pocket AI demo video">
        <div className="project-phone-screen">
          <video
            className="project-video"
            src="/assets/videos/pocket-ai.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>
      </div>
      <div className="project-video-details">
        <p className="project-video-kicker">CATTLElytics Inc. Capstone</p>
        <h3>Pocket AI</h3>
        <p>
          Voice-driven task management app for low-connectivity farm environments.
        </p>
        <ul>
          <li>Natural speech to structured tasks using Whisper and an LLM pipeline.</li>
          <li>Flask REST APIs for auth, task lifecycle management, and syncing.</li>
          <li>Offline-first React Native app with local SQLite storage.</li>
          <li>Usability testing hit 100% voice recognition accuracy under simulated barn noise.</li>
          <li>Featured on the official McMaster Engineering Instagram.</li>
        </ul>
        <div className="project-video-tags" aria-label="Pocket AI tech stack">
          <span>Python</span>
          <span>Flask</span>
          <span>React Native</span>
          <span>OpenAI Whisper</span>
          <span>REST API</span>
        </div>
      </div>
    </div>
  );
}
