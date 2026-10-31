"use client";

import type { Project } from "./projectData";

type ProjectDetailsWindowProps = {
  project: Project;
};

export default function ProjectDetailsWindow({ project }: ProjectDetailsWindowProps) {
  return (
    <div className="project-detail-panel">
      <article className="project-detail-copy">
        <p className="project-video-kicker">
          {project.details.context} · {project.year}
        </p>
        <h3>{project.name}</h3>
        <p className="project-detail-overview">{project.details.overview}</p>

        <section className="project-detail-section" aria-labelledby={`${project.id}-highlights`}>
          <h4 id={`${project.id}-highlights`}>{project.details.highlightsLabel || "Highlights"}</h4>
          <ul>
            {project.details.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <section className="project-detail-section" aria-labelledby={`${project.id}-implementation`}>
          <h4 id={`${project.id}-implementation`}>{project.details.implementationLabel || "Implementation"}</h4>
          <ul>
            {project.details.implementation.map((implementationDetail) => (
              <li key={implementationDetail}>{implementationDetail}</li>
            ))}
          </ul>
        </section>

        {project.details.figures?.map((figure) => (
          <figure className="project-evidence-figure" key={figure.src}>
            <a href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${figure.alt}`}>
              <img src={figure.src} alt={figure.alt} loading="lazy" />
            </a>
            <figcaption>{figure.caption}</figcaption>
          </figure>
        ))}

        {project.details.contribution ? (
          <section className="project-detail-section" aria-labelledby={`${project.id}-contribution`}>
            <h4 id={`${project.id}-contribution`}>My contribution</h4>
            <p>{project.details.contribution}</p>
          </section>
        ) : null}

        {project.details.limitations ? (
          <section className="project-detail-section" aria-labelledby={`${project.id}-limitations`}>
            <h4 id={`${project.id}-limitations`}>Limitations</h4>
            <p>{project.details.limitations}</p>
          </section>
        ) : null}

        {project.details.disclosure ? <p className="project-disclosure">{project.details.disclosure}</p> : null}

        {project.details.evidenceLinks?.length ? (
          <section className="project-detail-section" aria-labelledby={`${project.id}-evidence`}>
            <h4 id={`${project.id}-evidence`}>Explore the evidence</h4>
            <ul className="project-evidence-links">
              {project.details.evidenceLinks.map((link) => (
                <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="project-video-tags" aria-label={`${project.name} tech stack`}>
          {project.stack.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </article>
    </div>
  );
}

export function ProjectDetailsLinks({ project }: ProjectDetailsWindowProps) {
  const showDemoLink = Boolean(project.demo && !project.demoMode);
  if (!project.github && !showDemoLink) return null;

  return (
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
  );
}
