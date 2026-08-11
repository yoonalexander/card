"use client";

import type { Project } from "./projectData";

type ProjectDetailsWindowProps = {
  project: Project;
};

export default function ProjectDetailsWindow({ project }: ProjectDetailsWindowProps) {
  const showDemoLink = Boolean(project.demo && !project.demoMode);

  return (
    <div className={`project-detail-panel${project.detailVideo ? " project-detail-panel-video" : ""}`}>
      <div className="project-detail-media-column">
        {project.detailVideo ? (
          <div className="project-phone-demo" aria-label={`${project.name} demo video`}>
            <div className="project-phone-screen">
              <video
                className="project-video"
                src={project.detailVideo}
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
        ) : (
          <div className={`project-detail-image${project.imageFit === "contain" ? " project-detail-image-contain" : ""}`}>
            <img src={project.image} alt={`${project.name} project preview`} />
          </div>
        )}

        {project.github || showDemoLink ? (
          <div className="project-detail-links" aria-label={`${project.name} links`}>
            {showDemoLink ? (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                {project.demoLabel || "Open live demo"}
              </a>
            ) : null}
            {project.github ? (
              <a className="project-detail-link-secondary" href={project.github} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <article className="project-detail-copy">
        <p className="project-video-kicker">
          {project.details.context} · {project.year}
        </p>
        <h3>{project.name}</h3>
        <p className="project-detail-overview">{project.details.overview}</p>

        <section className="project-detail-section" aria-labelledby={`${project.id}-highlights`}>
          <h4 id={`${project.id}-highlights`}>Highlights</h4>
          <ul>
            {project.details.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <section className="project-detail-section" aria-labelledby={`${project.id}-implementation`}>
          <h4 id={`${project.id}-implementation`}>Implementation</h4>
          <ul>
            {project.details.implementation.map((implementationDetail) => (
              <li key={implementationDetail}>{implementationDetail}</li>
            ))}
          </ul>
        </section>

        <div className="project-video-tags" aria-label={`${project.name} tech stack`}>
          {project.stack.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </article>
    </div>
  );
}
