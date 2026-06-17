"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const projectTopics = ["AI/ML", "Web Apps", "Mobile", "Games", "Graphics", "Data/NLP", "Back-End", "Course Work"] as const;

type ProjectTopic = (typeof projectTopics)[number];

const projects = [
  {
    name: "Pocket AI",
    year: "2025 - 2026",
    image: "/assets/images/Pocket AI Poster.png",
    imageFit: "contain",
    summary:
      "Capstone voice-to-task system for CATTLElytics Inc. that turns natural speech into structured farm tasks using Whisper, an LLM pipeline, Flask APIs, and React Native.",
    stack: ["Python", "Flask", "React Native", "OpenAI Whisper", "REST API"],
    topics: ["AI/ML", "Mobile", "Back-End", "Course Work"],
    demo: "/assets/videos/pocket-ai.mp4",
    demoLabel: "Demo video",
    demoMode: "window",
  },
  {
    name: "Particle Engine",
    year: "2026",
    image: "/assets/images/Particle-Engine.png",
    summary:
      "Interactive React and Three.js particle simulation that morphs up to 30,000 particles between text, images, drawings, 2D shapes, and 3D forms.",
    stack: ["React", "Three.js", "WebGL", "Particle Systems"],
    topics: ["Web Apps", "Graphics"],
    demo: "https://www.alexyoon.com/particle-engine/",
  },
  {
    name: "CraveAI",
    year: "2025",
    image: "/assets/images/CraveAI.png",
    summary: "RAG chatbot for mood- and craving-based restaurant recommendations.",
    stack: ["Python", "LangChain", "OpenAI API", "FastAPI", "React"],
    topics: ["AI/ML", "Web Apps", "Back-End"],
    github: "https://github.com/yoonalexander/CraveAI",
    demo: "https://www.alexyoon.com/craveai",
  },
  {
    name: "Spam vs. Ham",
    year: "2025",
    image: "/assets/images/Spam_vs_ham.png",
    summary:
      "Explainable SMS spam and phishing detector using TF-IDF n-grams, handcrafted message cues, and a linear SVM.",
    stack: ["Python", "scikit-learn", "Linear SVM", "TF-IDF"],
    topics: ["AI/ML", "Data/NLP", "Course Work"],
    demo: "/assets/files/spam_vs_ham_report.pdf",
    demoLabel: "See report",
  },
  {
    name: "MAL Anime Score Predictions",
    year: "2025",
    image: "/assets/images/anime-score-predictor.png",
    summary: "ML ranking workflow with a React front end and API pipeline.",
    stack: ["Python", "FastAPI", "scikit-learn", "React"],
    topics: ["AI/ML", "Web Apps", "Data/NLP", "Back-End"],
    github: "https://github.com/yoonalexander/mal-anime-score-predictor",
  },
  {
    name: "Portfolio Website",
    year: "2025",
    image: "/assets/images/Portfolio.png",
    summary: "A personal portfolio built from a lightweight static site and migrated to Next.js.",
    stack: ["Next.js", "React", "CSS"],
    topics: ["Web Apps"],
    github: "https://github.com/yoonalexander/card",
    demo: "https://yoonalexander.github.io/card",
    demoMode: "message",
  },
  {
    name: "XY-Ball-Fight",
    year: "2025",
    image: "/assets/images/XY-Ball-Fight.png",
    summary: "Vanilla JS arena game with simple AI and physics.",
    stack: ["HTML", "CSS", "JavaScript", "Game Loop"],
    topics: ["Games", "Web Apps"],
    github: "https://github.com/yoonalexander/XY-Ball-Fight",
  },
  {
    name: "Chess-Bot",
    year: "2025",
    image: "/assets/images/Chess.png",
    summary: "Python chess agent built around minimax and alpha-beta pruning.",
    stack: ["Python", "Minimax", "Alpha-Beta Pruning"],
    topics: ["AI/ML", "Games"],
    github: "https://github.com/yoonalexander/Chess-Bot",
  },
  {
    name: "Evodle",
    year: "2025",
    image: "/assets/images/Evodle.png",
    summary: "Idle browser game driven by evolutionary systems.",
    stack: ["JavaScript", "Game Design", "Evolutionary Algorithms"],
    topics: ["Games", "Web Apps"],
    github: "https://github.com/yoonalexander/Evodle",
    demo: "https://yoonalexander.github.io/Evodle",
  },
  {
    name: "NLP Analysis Tool",
    year: "2024",
    image: "/assets/images/NLP.png",
    summary: "Keyword extraction, sentiment, and classification tooling.",
    stack: ["Python", "NLTK", "spaCy", "Text Analytics"],
    topics: ["AI/ML", "Data/NLP"],
    github: "https://github.com/yoonalexander/Natural-Language-Processing-Analysis-Tool",
  },
  {
    name: "VanklCommApp",
    year: "2024",
    image: "/assets/images/Vankl.png",
    summary: "React Native chat experience backed by Firebase.",
    stack: ["React Native", "Firebase", "Realtime Messaging"],
    topics: ["Mobile", "Back-End", "Course Work"],
    github: "https://github.com/yoonalexander/VanklCommApp",
  },
  {
    name: "ACMERun",
    year: "2023",
    image: "/assets/images/ACME-Run.png",
    summary: "Android running tracker with Google Fit integrations.",
    stack: ["Kotlin", "Jetpack Compose", "Android", "Google Fit"],
    topics: ["Mobile", "Course Work"],
    github: "https://github.com/yoonalexander/Fitness-Run-Application-ACMERun",
  },
  {
    name: "Island Generator",
    year: "2023",
    image: "/assets/images/Island.png",
    summary: "Procedural terrain generation in Java.",
    stack: ["Java", "Perlin Noise", "Procedural Generation"],
    topics: ["Games", "Graphics", "Course Work"],
    github: "https://github.com/yoonalexander/Island-Generator",
  },
  {
    name: "Mesh Terrain Generator",
    year: "2023",
    image: "/assets/images/Mesh.png",
    summary: "3D terrain meshes with UV mapping support.",
    stack: ["Java", "3D Graphics", "Heightmaps"],
    topics: ["Graphics", "Course Work"],
    github: "https://github.com/yoonalexander/Mesh-Terrain-Generator",
  },
  {
    name: "Piraten-Karpen",
    year: "2023",
    image: "/assets/images/piraten karpen.png",
    summary: "Unity pirate adventure with procedural maps.",
    stack: ["Unity", "C#", "Procedural Maps", "Pixel Art"],
    topics: ["Games", "Graphics", "Course Work"],
    github: "https://github.com/yoonalexander/Piraten-Karpen",
  },
];

function getFilteredProjects(selectedTopics: ProjectTopic[]) {
  return selectedTopics.length === 0
    ? projects
    : projects.filter((project) => selectedTopics.every((selectedTopic) => project.topics.includes(selectedTopic)));
}

type ProjectsSectionProps = {
  onOpenProjectDemo?: (projectName: string) => void;
};

type Project = (typeof projects)[number];

type ProjectRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type LeavingProject = {
  id: string;
  project: Project;
  rect: ProjectRect;
};

export default function ProjectsSection({ onOpenProjectDemo }: ProjectsSectionProps) {
  const [showPortfolioMessage, setShowPortfolioMessage] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<ProjectTopic[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState(() => getFilteredProjects([]));
  const [leavingProjects, setLeavingProjects] = useState<LeavingProject[]>([]);
  const projectCardRefs = useRef(new Map<string, HTMLElement>());
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const previousProjectRects = useRef<Map<string, ProjectRect> | null>(null);
  const liquidAnimationTimers = useRef<number[]>([]);
  const activeCardAnimations = useRef<Animation[]>([]);
  const blurAfterPointerActivation = (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.currentTarget.blur();
  };

  useEffect(() => {
    return () => {
      liquidAnimationTimers.current.forEach((timer) => window.clearTimeout(timer));
      activeCardAnimations.current.forEach((animation) => animation.cancel());
    };
  }, []);

  const setProjectCardRef = (projectName: string) => (element: HTMLElement | null) => {
    if (element) {
      projectCardRefs.current.set(projectName, element);
      return;
    }

    projectCardRefs.current.delete(projectName);
  };

  const getProjectRects = () => {
    const resultsElement = resultsRef.current;
    const resultsRect = resultsElement?.getBoundingClientRect();
    const nextRects = new Map<string, ProjectRect>();

    if (!resultsRect) {
      return nextRects;
    }

    projectCardRefs.current.forEach((element, projectName) => {
      const rect = element.getBoundingClientRect();
      nextRects.set(projectName, {
        top: rect.top - resultsRect.top,
        left: rect.left - resultsRect.left,
        width: rect.width,
        height: rect.height,
      });
    });

    return nextRects;
  };

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      previousProjectRects.current = null;
      return;
    }

    const firstRects = previousProjectRects.current;
    previousProjectRects.current = null;

    if (!firstRects) {
      return;
    }

    activeCardAnimations.current.forEach((animation) => animation.cancel());
    activeCardAnimations.current = [];

    const frame = window.requestAnimationFrame(() => {
      displayedProjects.forEach((project) => {
        const element = projectCardRefs.current.get(project.name);

        if (!element) {
          return;
        }

        const previousRect = firstRects.get(project.name);

        if (!previousRect) {
          activeCardAnimations.current.push(
            element.animate(
              [
                {
                  opacity: 0,
                  filter: "blur(18px) saturate(1.45)",
                  transform: "translate3d(0, 16px, 0) scale(0.94)",
                  clipPath: "inset(14% 5% 0 5% round 18px)",
                },
                {
                  opacity: 1,
                  filter: "blur(0) saturate(1)",
                  transform: "translate3d(0, 0, 0) scale(1)",
                  clipPath: "inset(0 0 0 0 round 14px)",
                },
              ],
              {
                duration: 620,
                easing: "cubic-bezier(0.19, 1, 0.22, 1)",
                fill: "both",
              },
            ),
          );
          return;
        }

        const resultsRect = resultsRef.current?.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        if (!resultsRect) {
          return;
        }

        const lastRect = {
          top: rect.top - resultsRect.top,
          left: rect.left - resultsRect.left,
          width: rect.width,
          height: rect.height,
        };
        const deltaX = previousRect.left - lastRect.left;
        const deltaY = previousRect.top - lastRect.top;
        const scaleX = previousRect.width / lastRect.width;
        const scaleY = previousRect.height / lastRect.height;

        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5 && Math.abs(scaleX - 1) < 0.01 && Math.abs(scaleY - 1) < 0.01) {
          return;
        }

        activeCardAnimations.current.push(
          element.animate(
            [
              {
                transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
                filter: "blur(0) saturate(1)",
              },
              {
                transform: "translate3d(0, 0, 0) scale(1)",
                filter: "blur(0) saturate(1)",
              },
            ],
            {
              duration: 480,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            },
          ),
        );
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [displayedProjects]);

  const applySelectedTopics = (nextTopics: ProjectTopic[]) => {
    const nextProjects = getFilteredProjects(nextTopics);
    const nextProjectNames = new Set(nextProjects.map((project) => project.name));
    const previousRects = getProjectRects();

    liquidAnimationTimers.current.forEach((timer) => window.clearTimeout(timer));
    liquidAnimationTimers.current = [];
    previousProjectRects.current = previousRects;
    setSelectedTopics(nextTopics);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLeavingProjects([]);
      setDisplayedProjects(nextProjects);
      return;
    }

    setLeavingProjects(
      displayedProjects
        .filter((project) => !nextProjectNames.has(project.name))
        .map((project) => ({
          id: `${project.name}-${Date.now()}`,
          project,
          rect: previousRects.get(project.name) || { top: 0, left: 0, width: 0, height: 0 },
        })),
    );
    setDisplayedProjects(nextProjects);
    liquidAnimationTimers.current.push(
      window.setTimeout(() => {
        setLeavingProjects([]);
      }, 260),
    );
  };

  const toggleTopic = (topic: ProjectTopic) => {
    const nextTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((currentTopic) => currentTopic !== topic)
      : [...selectedTopics, topic];

    applySelectedTopics(nextTopics);
  };

  return (
    <div className="project-panel">
      <div className="project-topic-filters" aria-label="Filter projects by topic">
        <button
          className={`project-topic-button${selectedTopics.length === 0 ? " project-topic-button-active" : ""}`}
          type="button"
          aria-pressed={selectedTopics.length === 0}
          onPointerUp={blurAfterPointerActivation}
          onClick={() => applySelectedTopics([])}
        >
          All
        </button>
        {projectTopics.map((topic) => {
          const isSelected = selectedTopics.includes(topic);

          return (
            <button
              className={`project-topic-button${isSelected ? " project-topic-button-active" : ""}`}
              type="button"
              key={topic}
              aria-pressed={isSelected}
              onPointerUp={blurAfterPointerActivation}
              onClick={() => toggleTopic(topic)}
            >
              {topic}
            </button>
          );
        })}
      </div>

      <p className="project-demo-tip">Some projects have live demos. Hover over a project to see if it does.</p>

      <div className="project-results" ref={resultsRef} aria-live="polite">
        <div className="project-liquid-layer" aria-hidden="true">
          {leavingProjects.map(({ id, project, rect }) => (
            <ProjectCard
              className="project-card-liquid-ghost"
              inertContent
              key={id}
              project={project}
              style={{
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }}
            />
          ))}
        </div>
        {displayedProjects.length > 0 ? (
          <div className="project-grid">
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.name}
                onOpenProjectDemo={onOpenProjectDemo}
                onPointerActivation={blurAfterPointerActivation}
                onShowPortfolioMessage={() => setShowPortfolioMessage(true)}
                project={project}
                refCallback={setProjectCardRef(project.name)}
                showPortfolioMessage={showPortfolioMessage}
              />
            ))}
          </div>
        ) : (
          <p className="project-empty-state">No projects match that topic mix.</p>
        )}
      </div>
    </div>
  );
}

type ProjectCardProps = {
  className?: string;
  inertContent?: boolean;
  onOpenProjectDemo?: (projectName: string) => void;
  onPointerActivation?: (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onShowPortfolioMessage?: () => void;
  project: Project;
  refCallback?: (element: HTMLElement | null) => void;
  showPortfolioMessage?: boolean;
  style?: CSSProperties;
};

function ProjectCard({
  className = "",
  inertContent = false,
  onOpenProjectDemo,
  onPointerActivation,
  onShowPortfolioMessage,
  project,
  refCallback,
  showPortfolioMessage,
  style,
}: ProjectCardProps) {
  return (
    <article className={`project-card${className ? ` ${className}` : ""}`} ref={refCallback} style={style}>
      <div className={`project-image-wrap${project.imageFit === "contain" ? " project-image-contain" : ""}`}>
        <img src={project.image} alt={inertContent ? "" : `${project.name} preview`} />
        <div className="project-overlay">
          <p>{project.summary}</p>
          {renderProjectDemo(project, inertContent, showPortfolioMessage, onPointerActivation, onOpenProjectDemo, onShowPortfolioMessage)}
        </div>
      </div>

      <div className="project-card-body">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-meta">
          {project.year} - {project.stack.join(", ")}
        </p>
      </div>

      {project.github ? (
        inertContent ? (
          <span className="project-github-link">
            <img src="/assets/icons/github-logo.png" alt="" aria-hidden="true" />
          </span>
        ) : (
          <a
            className="project-github-link"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onPointerUp={onPointerActivation}
            aria-label={`Open ${project.name} GitHub`}
          >
            <img src="/assets/icons/github-logo.png" alt="" aria-hidden="true" />
          </a>
        )
      ) : null}
    </article>
  );
}

function renderProjectDemo(
  project: Project,
  inertContent: boolean,
  showPortfolioMessage?: boolean,
  onPointerActivation?: (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => void,
  onOpenProjectDemo?: (projectName: string) => void,
  onShowPortfolioMessage?: () => void,
) {
  if (!project.demo) {
    return <span>demo coming later</span>;
  }

  if (inertContent) {
    return <span className="project-demo-button project-demo-ghost-label">{project.demoLabel || "Live demo"}</span>;
  }

  if (project.demoMode === "window") {
    return (
      <button
        className="project-demo-button"
        type="button"
        onPointerUp={onPointerActivation}
        onClick={() => onOpenProjectDemo?.(project.name)}
        aria-label={`Open ${project.name} demo video`}
      >
        {project.demoLabel || "Demo"}
      </button>
    );
  }

  if (project.demoMode === "message") {
    return (
      <button
        className="project-demo-button project-demo-message-button"
        type="button"
        onPointerUp={onPointerActivation}
        onClick={onShowPortfolioMessage}
        aria-label="This portfolio project is the current website"
      >
        {showPortfolioMessage ? "its this website silly :p" : project.demoLabel || "Live demo"}
      </button>
    );
  }

  return (
    <a
      className="project-demo-button"
      href={project.demo}
      target="_blank"
      rel="noopener noreferrer"
      onPointerUp={onPointerActivation}
      aria-label={`Open ${project.name} ${project.demoLabel || "live demo"}`}
    >
      {project.demoLabel || "Live demo"}
    </a>
  );
}
