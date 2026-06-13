"use client";

import { useState } from "react";

const projects = [
  {
    name: "Pocket AI",
    year: "2025 - 2026",
    image: "/assets/images/Pocket AI Poster.png",
    imageFit: "contain",
    summary:
      "Capstone voice-to-task system for CATTLElytics Inc. that turns natural speech into structured farm tasks using Whisper, an LLM pipeline, Flask APIs, and React Native.",
    stack: ["Python", "Flask", "React Native", "OpenAI Whisper", "REST API"],
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
  },
  {
    name: "CraveAI",
    year: "2025",
    image: "/assets/images/CraveAI.png",
    summary: "RAG chatbot for mood- and craving-based restaurant recommendations.",
    stack: ["Python", "LangChain", "OpenAI API", "FastAPI", "React"],
    github: "https://github.com/yoonalexander/CraveAI",
    demo: "https://www.alexyoon.com/craveai",
  },
  {
    name: "MAL Anime Score Predictions",
    year: "2025",
    image: "/assets/images/anime-score-predictor.png",
    summary: "ML ranking workflow with a React front end and API pipeline.",
    stack: ["Python", "FastAPI", "scikit-learn", "React"],
    github: "https://github.com/yoonalexander/mal-anime-score-predictor",
  },
  {
    name: "Portfolio Website",
    year: "2025",
    image: "/assets/images/Portfolio.png",
    summary: "A personal portfolio built from a lightweight static site and migrated to Next.js.",
    stack: ["Next.js", "React", "CSS"],
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
    github: "https://github.com/yoonalexander/XY-Ball-Fight",
  },
  {
    name: "Chess-Bot",
    year: "2025",
    image: "/assets/images/Chess.png",
    summary: "Python chess agent built around minimax and alpha-beta pruning.",
    stack: ["Python", "Minimax", "Alpha-Beta Pruning"],
    github: "https://github.com/yoonalexander/Chess-Bot",
  },
  {
    name: "Evodle",
    year: "2025",
    image: "/assets/images/Evodle.png",
    summary: "Idle browser game driven by evolutionary systems.",
    stack: ["JavaScript", "Game Design", "Evolutionary Algorithms"],
    github: "https://github.com/yoonalexander/Evodle",
    demo: "https://yoonalexander.github.io/Evodle",
  },
  {
    name: "NLP Analysis Tool",
    year: "2024",
    image: "/assets/images/NLP.png",
    summary: "Keyword extraction, sentiment, and classification tooling.",
    stack: ["Python", "NLTK", "spaCy", "Text Analytics"],
    github: "https://github.com/yoonalexander/Natural-Language-Processing-Analysis-Tool",
  },
  {
    name: "VanklCommApp",
    year: "2024",
    image: "/assets/images/Vankl.png",
    summary: "React Native chat experience backed by Firebase.",
    stack: ["React Native", "Firebase", "Realtime Messaging"],
    github: "https://github.com/yoonalexander/VanklCommApp",
  },
  {
    name: "ACMERun",
    year: "2023",
    image: "/assets/images/ACME-Run.png",
    summary: "Android running tracker with Google Fit integrations.",
    stack: ["Kotlin", "Jetpack Compose", "Android", "Google Fit"],
    github: "https://github.com/yoonalexander/Fitness-Run-Application-ACMERun",
  },
  {
    name: "Island Generator",
    year: "2023",
    image: "/assets/images/Island.png",
    summary: "Procedural terrain generation in Java.",
    stack: ["Java", "Perlin Noise", "Procedural Generation"],
    github: "https://github.com/yoonalexander/Island-Generator",
  },
  {
    name: "Mesh Terrain Generator",
    year: "2023",
    image: "/assets/images/Mesh.png",
    summary: "3D terrain meshes with UV mapping support.",
    stack: ["Java", "3D Graphics", "Heightmaps"],
    github: "https://github.com/yoonalexander/Mesh-Terrain-Generator",
  },
  {
    name: "Piraten-Karpen",
    year: "2023",
    image: "/assets/images/piraten karpen.png",
    summary: "Unity pirate adventure with procedural maps.",
    stack: ["Unity", "C#", "Procedural Maps", "Pixel Art"],
    github: "https://github.com/yoonalexander/Piraten-Karpen",
  },
];

type ProjectsSectionProps = {
  onOpenProjectDemo?: (projectName: string) => void;
};

export default function ProjectsSection({ onOpenProjectDemo }: ProjectsSectionProps) {
  const [showPortfolioMessage, setShowPortfolioMessage] = useState(false);

  return (
    <div className="project-panel">
      <p className="project-demo-tip">Some projects have live demos. Hover over a project to see if it does.</p>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className={`project-image-wrap${project.imageFit === "contain" ? " project-image-contain" : ""}`}>
              <img src={project.image} alt={`${project.name} preview`} />
              <div className="project-overlay">
                <p>{project.summary}</p>
                {project.demo && project.demoMode === "window" ? (
                  <button
                    className="project-demo-button"
                    type="button"
                    onClick={() => onOpenProjectDemo?.(project.name)}
                    aria-label={`Open ${project.name} demo video`}
                  >
                    {project.demoLabel || "Demo"}
                  </button>
                ) : project.demo && project.demoMode === "message" ? (
                  <button
                    className="project-demo-button project-demo-message-button"
                    type="button"
                    onClick={() => setShowPortfolioMessage(true)}
                    aria-label="This portfolio project is the current website"
                  >
                    {showPortfolioMessage ? "its this website silly :p" : project.demoLabel || "Live demo"}
                  </button>
                ) : project.demo ? (
                  <a
                    className="project-demo-button"
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} live demo`}
                  >
                    {project.demoLabel || "Live demo"}
                  </a>
                ) : (
                  <span>demo coming later</span>
                )}
              </div>
            </div>

            <div className="project-card-body">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-meta">
                {project.year} - {project.stack.join(", ")}
              </p>
            </div>

            {project.github ? (
              <a
                className="project-github-link"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name} GitHub`}
              >
                <img src="/assets/icons/github-logo.png" alt="" aria-hidden="true" />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
