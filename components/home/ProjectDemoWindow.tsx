"use client";

import type { Project } from "./projectData";
import TerminalRecording from "./TerminalRecording";

export default function ProjectDemoWindow({ project }: { project: Project }) {
  if (project.terminalRecording) return <TerminalRecording src={project.terminalRecording} name={project.name} />;
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
