"use client";

import type { Project } from "./projectData";
import dynamic from "next/dynamic";

const ConceptFirewallDemo = dynamic(() => import("./ConceptFirewallDemo"), {
  loading: () => <p className="project-demo-loading">Loading research replay…</p>,
});

export default function ProjectDemoWindow({ project }: { project: Project }) {
  if (project.visualDemo === "concept-firewall") return <ConceptFirewallDemo />;
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
