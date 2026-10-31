"use client";

import type { Project } from "./projectData";
import SudokuDemo from "./SudokuDemo";

export default function ProjectDemoWindow({ project }: { project: Project }) {
  if (project.visualDemo === "sudoku") return <SudokuDemo />;
  return (
    <video
      className="project-demo-video"
      aria-label={`${project.name} demo video`}
      src={project.demoVideo}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  );
}
