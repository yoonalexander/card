"use client";

import type { Project } from "./projectData";

export default function ProjectDemoWindow({ project }: { project: Project }) {
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
