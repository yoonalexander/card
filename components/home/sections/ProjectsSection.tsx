const projects = [
  {
    name: "CraveAI",
    year: "2025",
    image: "/assets/images/CraveAI.png",
    summary: "RAG chatbot for mood- and craving-based restaurant recommendations.",
    stack: ["Python", "LangChain", "OpenAI API", "FastAPI", "React"],
    github: "https://github.com/yoonalexander/CraveAI",
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

export default function ProjectsSection() {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
          {project.demo ? (
            <a
              className="project-demo-link"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.name} demo`}
            />
          ) : null}

          <div className="project-image-wrap">
            <img src={project.image} alt={`${project.name} preview`} />
            <div className="project-overlay">
              <p>{project.summary}</p>
              <span>{project.demo ? "click card for demo" : "demo coming later"}</span>
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
  );
}
