"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { projects, projectTopics, type Project, type ProjectId, type ProjectTopic } from "../projectData";

function getFilteredProjects(selectedTopics: ProjectTopic[]) {
  return selectedTopics.length === 0
    ? projects
    : projects.filter((project) => selectedTopics.every((selectedTopic) => project.topics.includes(selectedTopic)));
}

type ProjectsSectionProps = {
  onOpenProjectDetails?: (projectId: ProjectId) => void;
};

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

export default function ProjectsSection({ onOpenProjectDetails }: ProjectsSectionProps) {
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

      <p className="project-demo-tip">Click any project card to view its details.</p>

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
                onOpenProjectDetails={onOpenProjectDetails}
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
  onOpenProjectDetails?: (projectId: ProjectId) => void;
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
  onOpenProjectDetails,
  onPointerActivation,
  onShowPortfolioMessage,
  project,
  refCallback,
  showPortfolioMessage,
  style,
}: ProjectCardProps) {
  return (
    <article
      className={`project-card${className ? ` ${className}` : ""}`}
      ref={refCallback}
      style={style}
    >
      <div className={`project-image-wrap${project.imageFit === "contain" ? " project-image-contain" : ""}`}>
        <img src={project.image} alt={inertContent ? "" : `${project.name} preview`} />
      </div>

      <div className="project-card-body">
        <div className="project-heading-row">
          <h3 className="project-name">{project.name}</h3>
          <time className="project-date">{project.year}</time>
        </div>

        <p className="project-summary">{project.summary}</p>

        <div className="project-card-footer">
          <div className="project-tag-row" aria-label={`${project.name} technologies`}>
            <svg
              className="project-tag-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.75 5.2v5.5c0 .7.28 1.37.78 1.87l7.05 7.05a2.75 2.75 0 0 0 3.89 0l4.15-4.15a2.75 2.75 0 0 0 0-3.89L12.57 4.53a2.65 2.65 0 0 0-1.87-.78H5.2c-.8 0-1.45.65-1.45 1.45Z"
              />
              <circle cx="8.15" cy="8.15" r="1.45" fill="currentColor" stroke="none" />
            </svg>
            <ProjectTags projectName={project.name} technologies={project.stack} />
          </div>

          <div className="project-card-actions" aria-label={`${project.name} actions`}>
            {renderProjectDemoAction(
              project,
              inertContent,
              showPortfolioMessage,
              onPointerActivation,
              onOpenProjectDetails,
              onShowPortfolioMessage,
            )}
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
          </div>
        </div>
      </div>

      {!inertContent ? (
        <button
          className="project-card-details-hitbox"
          type="button"
          onPointerUp={onPointerActivation}
          onClick={() => onOpenProjectDetails?.(project.id)}
          aria-label={`View ${project.name} details`}
        />
      ) : null}
    </article>
  );
}

type ProjectTagsProps = {
  projectName: string;
  technologies: readonly string[];
};

function ProjectTags({ projectName, technologies }: ProjectTagsProps) {
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const [visibleTagCount, setVisibleTagCount] = useState(technologies.length);

  useLayoutEffect(() => {
    const tagsElement = tagsRef.current;

    if (!tagsElement) return;

    const updateVisibleTags = () => {
      const availableWidth = tagsElement.clientWidth;
      const tagElements = Array.from(tagsElement.querySelectorAll<HTMLElement>("[data-project-tag]"));
      const nextVisibleTagCount = tagElements.filter(
        (tagElement) => tagElement.offsetLeft + tagElement.offsetWidth <= availableWidth + 0.5,
      ).length;

      setVisibleTagCount((currentCount) =>
        currentCount === nextVisibleTagCount ? currentCount : nextVisibleTagCount,
      );
    };

    const resizeObserver = new ResizeObserver(updateVisibleTags);
    resizeObserver.observe(tagsElement);
    Array.from(tagsElement.children).forEach((tagElement) => resizeObserver.observe(tagElement));
    updateVisibleTags();

    return () => resizeObserver.disconnect();
  }, [technologies]);

  return (
    <div className="project-tags" ref={tagsRef} aria-label={`${projectName} technology tags`}>
      {technologies.map((technology, index) => {
        const isHidden = index >= visibleTagCount;

        return (
          <span
            className={isHidden ? "project-tag-hidden" : undefined}
            data-project-tag
            aria-hidden={isHidden || undefined}
            key={technology}
          >
            {technology}
          </span>
        );
      })}
    </div>
  );
}

function renderProjectDemoAction(
  project: Project,
  inertContent: boolean,
  showPortfolioMessage?: boolean,
  onPointerActivation?: (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => void,
  onOpenProjectDetails?: (projectId: ProjectId) => void,
  onShowPortfolioMessage?: () => void,
) {
  if (!project.demo) return null;

  if (inertContent) {
    return (
      <span className="project-card-demo-button project-demo-ghost-label">
        {project.demoMode === "window" ? "View demo" : project.demoLabel || "Demo"}
      </span>
    );
  }

  if (project.demoMode === "window") {
    return (
      <button
        className="project-card-demo-button"
        type="button"
        onPointerUp={onPointerActivation}
        onClick={() => onOpenProjectDetails?.(project.id)}
        aria-label={`View ${project.name} demo and details`}
      >
        View demo
      </button>
    );
  }

  if (project.demoMode === "message") {
    return (
      <button
        className="project-card-demo-button project-demo-message-button"
        type="button"
        onPointerUp={onPointerActivation}
        onClick={onShowPortfolioMessage}
        aria-label="This portfolio project is the current website"
      >
        {showPortfolioMessage ? "this website :p" : project.demoLabel || "Demo"}
      </button>
    );
  }

  return (
    <a
      className="project-card-demo-button"
      href={project.demo}
      target="_blank"
      rel="noopener noreferrer"
      onPointerUp={onPointerActivation}
      aria-label={`Open ${project.name} ${project.demoLabel || "live demo"}`}
    >
      {project.demoLabel || "Demo"}
    </a>
  );
}
