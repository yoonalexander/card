export const projectTopics = ["AI/ML", "Web Apps", "Mobile", "Games", "Graphics", "Data/NLP", "Back-End", "Course Work"] as const;

export type ProjectTopic = (typeof projectTopics)[number];

export type ProjectId =
  | "pocket-ai"
  | "particle-engine"
  | "crave-ai"
  | "spam-vs-ham"
  | "mal-anime-score-predictor"
  | "portfolio-website"
  | "cursora"
  | "xy-ball-fight"
  | "chess-bot"
  | "evodle"
  | "nlp-analysis-tool"
  | "vankl-comm-app"
  | "acme-run"
  | "island-generator"
  | "mesh-terrain-generator"
  | "piraten-karpen";

export type ProjectDetails = {
  context: string;
  overview: string;
  highlights: readonly string[];
  implementation: readonly string[];
};

export type Project = {
  id: ProjectId;
  name: string;
  year: string;
  image: string;
  imageFit?: "contain";
  summary: string;
  stack: readonly string[];
  topics: readonly ProjectTopic[];
  details: ProjectDetails;
  github?: string;
  demo?: string;
  demoLabel?: string;
  demoMode?: "window" | "message";
  detailVideo?: string;
};

export const projects: readonly Project[] = [
  {
    id: "pocket-ai",
    name: "Pocket AI",
    year: "2025 - 2026",
    image: "/assets/images/Pocket AI Poster.png",
    imageFit: "contain",
    summary:
      "Capstone voice-to-task system for CATTLElytics Inc. that turns natural speech into structured farm tasks using Whisper, an LLM pipeline, Flask APIs, and React Native.",
    stack: ["Python", "Flask", "React Native", "OpenAI Whisper", "REST API"],
    topics: ["AI/ML", "Mobile", "Back-End", "Course Work"],
    details: {
      context: "CATTLElytics Inc. Capstone",
      overview:
        "Pocket AI is a hands-free mobile task-management system for dairy farmers who need to capture health events, reminders, and work assignments without stopping to type in demanding barn environments.",
      highlights: [
        "Turns natural voice commands into structured farm tasks and health events.",
        "Supports offline caching and later synchronization in low-connectivity environments.",
        "Provides a cross-platform mobile workflow designed for hands-busy users.",
        "Reached 100% voice-recognition accuracy during usability testing with simulated barn noise.",
      ],
      implementation: [
        "OpenAI Whisper transcribes speech before an LLM pipeline extracts task fields and intent.",
        "Flask REST APIs handle authentication, task lifecycle operations, assignment, and syncing.",
        "The React Native client stores local data with SQLite so core workflows remain available offline.",
      ],
    },
    github: "https://github.com/MithunPara/pocket-ai",
    demo: "/assets/videos/pocket-ai.mp4",
    demoLabel: "Demo video",
    demoMode: "window",
    detailVideo: "/assets/videos/pocket-ai.mp4",
  },
  {
    id: "particle-engine",
    name: "Particle Engine",
    year: "2026",
    image: "/assets/images/Particle-Engine.png",
    summary:
      "Interactive React and Three.js particle simulation that morphs up to 30,000 particles between text, images, drawings, 2D shapes, and 3D forms.",
    stack: ["React", "Three.js", "WebGL", "Particle Systems"],
    topics: ["Web Apps", "Graphics"],
    details: {
      context: "Interactive Graphics Experiment",
      overview:
        "Particle Engine is an interactive WebGL playground for composing and transforming dense particle scenes directly in the browser.",
      highlights: [
        "Morphs as many as 30,000 particles between text, imported images, drawings, and geometric forms.",
        "Includes controls for color, density, motion, and scene appearance.",
        "Supports both 2D compositions and 3D particle forms in one interface.",
      ],
      implementation: [
        "React coordinates the control panel and scene state while Three.js manages rendering and cameras.",
        "Particle targets are sampled from source content and animated between position buffers on the GPU-backed canvas.",
        "The Vite application is deployed as a lightweight static web experience.",
      ],
    },
    github: "https://github.com/yoonalexander/Particle-Engine",
    demo: "https://www.alexyoon.com/particle-engine/",
  },
  {
    id: "crave-ai",
    name: "CraveAI",
    year: "2025",
    image: "/assets/images/CraveAI.png",
    summary:
      "Full-stack restaurant discovery app that uses OpenAI and Google Places to turn moods and cravings into personalized recommendations. Includes Supabase accounts, Google sign-in, and a FastAPI backend hosted on Render.",
    stack: ["React", "FastAPI", "OpenAI API", "Google Places", "Supabase", "Google OAuth", "Render"],
    topics: ["AI/ML", "Web Apps", "Back-End"],
    details: {
      context: "AI Restaurant Discovery",
      overview:
        "CraveAI is a conversational restaurant-discovery app that translates a user's mood, cravings, dietary needs, and location into practical nearby recommendations.",
      highlights: [
        "Guides users through a natural conversation instead of a rigid filter form.",
        "Enriches recommendations with live restaurant and location data from Google Places.",
        "Supports persistent Supabase accounts and sign-in with Google.",
      ],
      implementation: [
        "A React client manages the chat, recommendation cards, maps, and authenticated account experience.",
        "FastAPI and OpenAI coordinate conversational intent, recommendation reasoning, and structured responses.",
        "Supabase provides authentication and user data while the backend is deployed on Render.",
      ],
    },
    github: "https://github.com/yoonalexander/CraveAI",
    demo: "https://craveai.alexyoon.com/",
  },
  {
    id: "spam-vs-ham",
    name: "Spam vs. Ham",
    year: "2025",
    image: "/assets/images/Spam_vs_ham.png",
    summary:
      "Explainable SMS spam and phishing detector that combines TF-IDF n-grams with handcrafted message cues. A linear SVM classifies each message while supporting analysis of the signals behind its result.",
    stack: ["Python", "scikit-learn", "Linear SVM", "TF-IDF"],
    topics: ["AI/ML", "Data/NLP", "Course Work"],
    details: {
      context: "Applied NLP Classification",
      overview:
        "Spam vs. Ham explores accurate and explainable detection of unwanted SMS messages by combining statistical text features with interpretable message-level signals.",
      highlights: [
        "Classifies messages as legitimate, spam, or phishing-oriented content.",
        "Evaluates model quality with confusion matrices and comparative performance analysis.",
        "Surfaces recognizable message cues so predictions are easier to understand.",
      ],
      implementation: [
        "Word and character TF-IDF n-grams encode vocabulary, phrasing, and obfuscation patterns.",
        "Handcrafted features capture cues such as links, urgency, unusual punctuation, and message structure.",
        "A linear support-vector machine combines the feature sets into an efficient text classifier.",
      ],
    },
    demo: "/assets/files/spam_vs_ham_report.pdf",
    demoLabel: "See report",
  },
  {
    id: "mal-anime-score-predictor",
    name: "MAL Anime Score Predictor",
    year: "2025",
    image: "/assets/images/anime-score-predictor.png",
    summary:
      "Predicts MyAnimeList scores from pre-air seasonal metadata using a leakage-safe regression pipeline, Jikan ingestion, and an AniList fallback. The Vercel-hosted React site runs without a production backend by loading generated prediction JSON with uncertainty bands, search, sorting, season filters, and CSV export.",
    stack: ["Python", "scikit-learn", "LightGBM", "Jikan API", "AniList", "React", "Vite", "Vercel"],
    topics: ["AI/ML", "Web Apps", "Data/NLP", "Back-End"],
    details: {
      context: "Leakage-Safe ML Pipeline",
      overview:
        "This project predicts scores for upcoming seasonal anime using only metadata available before a title begins airing, then publishes the results through a backend-free static site.",
      highlights: [
        "Ingests seasonal metadata from Jikan with an AniList GraphQL fallback.",
        "Compares multiple regression models with chronological train, validation, and test splits.",
        "Publishes predictions, uncertainty bands, search, sorting, season switching, and CSV export.",
      ],
      implementation: [
        "The Python pipeline caches API responses and builds pre-air features from studios, genres, themes, source, type, episodes, season, and year.",
        "Random Forest, HistGradientBoosting, Ridge, and LightGBM models are evaluated without leaking post-release scores.",
        "Generated prediction JSON is committed for the React and Vite frontend, eliminating the need for a production API.",
      ],
    },
    github: "https://github.com/yoonalexander/mal-anime-score-predictor",
  },
  {
    id: "portfolio-website",
    name: "Portfolio Website",
    year: "2025",
    image: "/assets/images/Portfolio.png",
    summary:
      "Personal portfolio migrated from a lightweight static site to a component-based Next.js application. Features an interactive desktop-inspired interface, project filtering, responsive windows, and light and dark themes.",
    stack: ["Next.js", "React", "CSS"],
    topics: ["Web Apps"],
    details: {
      context: "Personal Portfolio",
      overview:
        "This portfolio presents projects and experience through a playful desktop-inspired interface while remaining responsive and accessible across device sizes.",
      highlights: [
        "Uses draggable, focusable windows for the site's main information sections.",
        "Includes responsive project filters, light and dark themes, sound effects, and small interactive secrets.",
        "Balances a distinctive visual identity with direct links to work, code, and contact information.",
      ],
      implementation: [
        "Next.js and React provide reusable section, window, navigation, and project-card components.",
        "CSS handles the window system, responsive breakpoints, theme variants, and animated visual effects.",
        "Project metadata is stored locally so the static deployment does not depend on a content backend.",
      ],
    },
    github: "https://github.com/yoonalexander/card",
    demo: "https://yoonalexander.github.io/card",
    demoMode: "message",
  },
  {
    id: "cursora",
    name: "Cursora",
    year: "2026",
    image: "/assets/images/Cursora.png",
    summary:
      "Neon browser sketch-and-dodge game controlled through cursor movement. Players complete quick quests, collect items, and avoid escalating bullet patterns inside a fast, lightweight JavaScript game loop.",
    stack: ["HTML", "CSS", "JavaScript", "Game Loop"],
    topics: ["Games", "Web Apps"],
    details: {
      context: "Browser Arcade Game",
      overview:
        "Cursora turns ordinary pointer movement into a neon arcade challenge built around drawing, collecting, and surviving increasingly busy hazards.",
      highlights: [
        "Uses the cursor itself as the player's primary movement and interaction mechanic.",
        "Combines quick quests, collectible objectives, and bullet-avoidance encounters.",
        "Runs directly in the browser with no installation or account required.",
      ],
      implementation: [
        "A custom JavaScript game loop updates player movement, hazards, collisions, quests, and score state.",
        "Canvas-style effects and CSS build the neon presentation around lightweight browser primitives.",
        "The experience is deployed as a self-contained static web game.",
      ],
    },
    demo: "https://alexyoon.com/cursora",
  },
  {
    id: "xy-ball-fight",
    name: "XY-Ball-Fight",
    year: "2025",
    image: "/assets/images/XY-Ball-Fight.png",
    summary:
      "Vanilla JavaScript arena game where players battle computer-controlled opponents using movement and collision physics. Built with a custom browser game loop, responsive controls, and lightweight HTML and CSS rendering.",
    stack: ["HTML", "CSS", "JavaScript", "Game Loop"],
    topics: ["Games", "Web Apps"],
    details: {
      context: "JavaScript Arena Game",
      overview:
        "XY-Ball-Fight is a compact browser arena game focused on movement, collisions, and battles against computer-controlled opponents.",
      highlights: [
        "Offers immediate browser-based matches with responsive player movement.",
        "Uses simple opponent AI to keep pressure on the player during each round.",
        "Builds its visual feedback and interface without a game-engine dependency.",
      ],
      implementation: [
        "A vanilla JavaScript loop updates entities, input, collisions, and match state.",
        "Lightweight physics govern position, contact, and arena interactions.",
        "HTML and CSS provide the surrounding interface while browser rendering drives gameplay.",
      ],
    },
    github: "https://github.com/yoonalexander/XY-Ball-Fight",
    demo: "https://www.alexyoon.com/xy-fight",
  },
  {
    id: "chess-bot",
    name: "Chess-Bot",
    year: "2025",
    image: "/assets/images/Chess.png",
    summary:
      "Python chess agent that searches possible moves with minimax and speeds up decision-making through alpha-beta pruning. It evaluates board states to choose competitive moves while avoiding unnecessary search branches.",
    stack: ["Python", "Minimax", "Alpha-Beta Pruning"],
    topics: ["AI/ML", "Games"],
    details: {
      context: "Search-Based Game AI",
      overview:
        "Chess-Bot is a Python chess agent that evaluates future move sequences to select competitive actions from the current board state.",
      highlights: [
        "Searches alternating player and opponent turns with the minimax algorithm.",
        "Reduces unnecessary search work through alpha-beta pruning.",
        "Uses board evaluation to compare candidate positions at the search horizon.",
      ],
      implementation: [
        "Legal moves form a search tree whose branches alternate between maximizing and minimizing turns.",
        "Alpha and beta bounds prune branches that cannot improve the selected result.",
        "A heuristic evaluation function converts board positions into comparable scores.",
      ],
    },
    github: "https://github.com/yoonalexander/Chess-Bot",
  },
  {
    id: "evodle",
    name: "Evodle",
    year: "2025",
    image: "/assets/images/Evodle.png",
    summary:
      "Idle browser game where progression is driven by evolutionary systems and increasingly capable generations. Combines automated progression, game design, and evolutionary algorithms in a lightweight JavaScript experience.",
    stack: ["JavaScript", "Game Design", "Evolutionary Algorithms"],
    topics: ["Games", "Web Apps"],
    details: {
      context: "Evolutionary Idle Clicker",
      overview:
        "Evodle is an idle clicker where a microscopic organism grows through branching animal paths, upgrades, automation, and repeatable prestige progression.",
      highlights: [
        "Lets players evolve through mammal, bird, and fish branches with distinct progression choices.",
        "Combines click power, purchasable auto-clickers, and long-term prestige bonuses.",
        "Runs as a single lightweight browser experience without a build step.",
      ],
      implementation: [
        "JavaScript manages resources, upgrade costs, automatic income, evolution choices, and prestige state.",
        "Branching configuration data defines the available animals and evolutionary paths.",
        "The interface is implemented in a self-contained HTML application for simple static hosting.",
      ],
    },
    github: "https://github.com/yoonalexander/Evodle",
    demo: "https://yoonalexander.github.io/Evodle",
  },
  {
    id: "nlp-analysis-tool",
    name: "NLP Analysis Tool",
    year: "2024",
    image: "/assets/images/NLP.png",
    summary:
      "Python NLP toolkit for extracting keywords, measuring sentiment, and classifying text with NLTK and spaCy. It brings several common analysis workflows together for exploring and understanding unstructured language data.",
    stack: ["Python", "NLTK", "spaCy", "Text Analytics"],
    topics: ["AI/ML", "Data/NLP"],
    details: {
      context: "Unstructured Text Analysis",
      overview:
        "NLP Analysis Tool brings several common language-processing tasks together in a Python workflow for turning unstructured text into more actionable information.",
      highlights: [
        "Extracts keywords and important terms from source text.",
        "Measures sentiment and categorizes text through classification workflows.",
        "Organizes reusable analysis steps around sample datasets for experimentation.",
      ],
      implementation: [
        "NLTK supports tokenization, normalization, and classic text-processing operations.",
        "spaCy contributes production-oriented linguistic parsing and document features.",
        "A Python analysis script coordinates preprocessing, feature extraction, and reported results.",
      ],
    },
    github: "https://github.com/yoonalexander/Natural-Language-Processing-Analysis-Tool",
  },
  {
    id: "vankl-comm-app",
    name: "VanklCommApp",
    year: "2024",
    image: "/assets/images/Vankl.png",
    summary:
      "Cross-platform React Native messaging application backed by Firebase for real-time conversations. Explores mobile interface design, cloud-connected data flow, and responsive message updates in a course project.",
    stack: ["React Native", "Firebase", "Realtime Messaging"],
    topics: ["Mobile", "Back-End", "Course Work"],
    details: {
      context: "Team Mobile Application",
      overview:
        "VanklCommApp is a team-built mobile communication application focused on real-time conversations and a practical cross-platform messaging experience.",
      highlights: [
        "Supports mobile communication flows through a React Native interface.",
        "Keeps conversation data synchronized through cloud-backed services.",
        "Explores team development across client, backend, and authentication concerns.",
      ],
      implementation: [
        "React Native provides reusable screens and native-feeling interaction across devices.",
        "Firebase stores shared application data and propagates real-time updates.",
        "The project separates mobile UI concerns from its cloud communication layer.",
      ],
    },
    github: "https://github.com/yoonalexander/VanklCommApp",
  },
  {
    id: "acme-run",
    name: "ACMERun",
    year: "2023",
    image: "/assets/images/ACME-Run.png",
    summary:
      "Android fitness tracker built with Kotlin and Jetpack Compose to record running activity through Google Fit. Combines a native mobile interface, fitness-data integration, and workout-oriented tracking flows.",
    stack: ["Kotlin", "Jetpack Compose", "Android", "Google Fit"],
    topics: ["Mobile", "Course Work"],
    details: {
      context: "Android Fitness Application",
      overview:
        "ACMERun is a native Android running companion that connects workout-oriented screens with activity information from Google Fit.",
      highlights: [
        "Presents running and fitness data through a focused mobile interface.",
        "Connects to Google Fit so activity information can participate in the user's fitness ecosystem.",
        "Uses modern declarative Android UI patterns throughout the experience.",
      ],
      implementation: [
        "Kotlin supplies the application logic and Android platform integration.",
        "Jetpack Compose builds reusable, state-driven screens and controls.",
        "Google Fit APIs provide access to relevant activity and workout data.",
      ],
    },
    github: "https://github.com/yoonalexander/Fitness-Run-Application-ACMERun",
  },
  {
    id: "island-generator",
    name: "Island Generator",
    year: "2023",
    image: "/assets/images/Island.png",
    summary:
      "Java terrain generator that uses Perlin noise to create varied procedural island landscapes. It translates layered noise values into repeatable maps for experimenting with world generation and game environments.",
    stack: ["Java", "Perlin Noise", "Procedural Generation"],
    topics: ["Games", "Graphics", "Course Work"],
    details: {
      context: "Procedural World Generation",
      overview:
        "Island Generator is a Java terrain experiment that turns layered noise into repeatable island-shaped maps for games and graphics exploration.",
      highlights: [
        "Generates varied terrain layouts from procedural inputs rather than authored maps.",
        "Uses smooth noise to create more natural transitions between terrain regions.",
        "Supports repeatable generation for testing and iteration.",
      ],
      implementation: [
        "Perlin noise produces continuous values that form the base height field.",
        "Layering and thresholds translate those values into recognizable terrain regions.",
        "Java classes separate generation parameters, map construction, and visualization concerns.",
      ],
    },
    github: "https://github.com/yoonalexander/Island-Generator",
  },
  {
    id: "mesh-terrain-generator",
    name: "Mesh Terrain Generator",
    year: "2023",
    image: "/assets/images/Mesh.png",
    summary:
      "Java graphics project that converts heightmap data into renderable 3D terrain meshes. It generates geometry and UV mapping information for textured procedural landscapes and graphics experiments.",
    stack: ["Java", "3D Graphics", "Heightmaps"],
    topics: ["Graphics", "Course Work"],
    details: {
      context: "3D Graphics Pipeline",
      overview:
        "Mesh Terrain Generator converts height information into structured 3D geometry suitable for rendering textured terrain surfaces.",
      highlights: [
        "Builds terrain vertices and faces from heightmap-style source data.",
        "Produces UV coordinates so textures can be mapped across the resulting surface.",
        "Explores the data structures behind procedural mesh construction.",
      ],
      implementation: [
        "A regular height grid is sampled into positioned 3D vertices.",
        "Neighboring samples are connected into triangles with consistent winding and indexing.",
        "UV values are generated alongside geometry to support textured rendering.",
      ],
    },
    github: "https://github.com/yoonalexander/Mesh-Terrain-Generator",
  },
  {
    id: "piraten-karpen",
    name: "Piraten-Karpen",
    year: "2023",
    image: "/assets/images/piraten karpen.png",
    summary:
      "Unity pirate adventure featuring a pixel-art presentation and procedurally generated maps. Built in C# to explore replayable layouts, game systems, and a cohesive pirate-themed experience.",
    stack: ["Unity", "C#", "Procedural Maps", "Pixel Art"],
    topics: ["Games", "Graphics", "Course Work"],
    details: {
      context: "Unity Game Project",
      overview:
        "Piraten-Karpen is a pirate-themed Unity game combining a pixel-art presentation with procedurally assembled maps and replayable encounters.",
      highlights: [
        "Builds a cohesive pirate setting through custom pixel-art visuals.",
        "Uses procedural layouts to vary the playable map between sessions.",
        "Brings together movement, world interaction, and game-state systems in Unity.",
      ],
      implementation: [
        "C# scripts coordinate player behavior, gameplay state, and generated world content.",
        "Unity scenes and prefabs organize reusable environment and interaction elements.",
        "Procedural map logic assembles playable layouts from configurable components.",
      ],
    },
    github: "https://github.com/yoonalexander/Piraten-Karpen",
  },
];

export function getProjectById(projectId: string) {
  return projects.find((project) => project.id === projectId);
}
