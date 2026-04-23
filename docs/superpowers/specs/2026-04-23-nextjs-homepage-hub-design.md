# Next.js Migration and Interactive Homepage Design

## Goal

Migrate the existing static portfolio site into a Next.js app while preserving the current visual identity. After migration, refactor only the homepage behavior so the site becomes a single-page interactive hub. The result must look like the same site at first glance, with better structure and in-card interaction instead of section navigation.

## Non-Negotiable Constraints

- This is not a redesign.
- Preserve the current visual identity as closely as possible.
- Do not change colors, fonts, spacing system, card design, or overall aesthetic unless a small structural adjustment is strictly required for functionality.
- Do not replace the current centered-card homepage layout with a new hero, navbar, or template-style layout.
- Use Shar's site only as interaction inspiration, not as a visual reference to copy.
- Keep the current homepage intro text, social icons, and theme toggle behavior.
- Keep the current project route in the codebase as a fallback, but remove links to it from the main homepage flow.

## Current State

The site is currently a static HTML/CSS/JavaScript project with:

- `index.html` for the homepage
- `projects.html` for the separate projects archive
- `assets/` for images, icons, and resume files
- inline CSS and inline theme toggle scripts in both pages

The homepage currently contains:

- a centered card
- two intro paragraphs
- social icon links
- three action buttons: resume, projects, and let's chat
- a theme toggle button

The projects page currently contains:

- a richer standalone project browser
- project detail content for all portfolio projects

## Target State

The final app will be a Next.js project where:

- the homepage remains the main centered-card experience
- the homepage becomes the primary interactive hub
- section buttons update content inside the same homepage card
- no homepage section interaction causes navigation
- the default homepage state shows only the basic card content with no section open
- all project content is available from the homepage through a `Projects` section
- the old `/projects` route may remain as fallback code, but the homepage should not rely on it

## Recommended Interaction Model

### Chosen approach

Keep the existing homepage intro content always visible and reveal one optional content panel below the section buttons inside the same card.

### Why this approach

This is the safest way to preserve the current homepage appearance. On initial load, the card still reads like the current homepage. Interaction is added only after the user clicks a section button. This respects the user's requirement that nothing should be open by default and minimizes visual drift.

### Rejected alternatives

#### Replace the intro area with section content

This would make the interaction more aggressive and would move the homepage further away from its current feel.

#### Use multiple accordion sections

This would change the reading behavior too much and weaken the "single interactive hub" model.

## Homepage Behavior

### Initial state

On first load:

- the centered card is visible
- the intro text is visible
- the social icons are visible
- the theme toggle is visible
- the new section buttons are visible
- no section content panel is open

### Section buttons

The homepage button row will be replaced with these section buttons:

- About
- Links
- Work
- Projects
- FAQ
- Contact

### Interaction rules

- Clicking a section button does not navigate.
- Clicking a button sets the active section and reveals that section inside the same card.
- Clicking a different button switches the panel content.
- Clicking the currently active button again closes the panel and returns the card to the idle state.
- Only one section is open at a time.

### Visual behavior

- The card, typography, spacing, button language, and social icon presentation stay visually consistent with the existing site.
- New interaction states are limited to subtle hover, focus, and active states.
- Any content reveal should be restrained and should not introduce a new animation-heavy style.

## Section Content Plan

### About

Expanded background and personal details that support the homepage intro without replacing it.

### Links

External links and utility actions, including:

- resume
- scheduling / let's chat
- any external profile links worth surfacing as text links

### Work

A concise summary of internships, experience, and current focus, using existing homepage language where possible.

### Projects

All project content migrated from the current `projects.html`. This section becomes the in-card project browser on the homepage.

### FAQ

Short personal or professional question-answer content that fits the current tone and can be edited easily later.

### Contact

Direct contact options and a clear path to reach out, while preserving the current email and chat-oriented actions.

## Migration Architecture

### Framework

Use a standard Next.js app structure with the `app/` router.

### Static assets

Move all static assets into `public/`:

- icons
- images
- resume PDFs
- favicon assets

Existing asset naming should remain stable where practical to reduce churn.

### Routing

- `app/page.tsx` will become the interactive homepage.
- `app/projects/page.tsx` may remain as a fallback route, but should not be linked from the homepage.

### Styling

- Move the existing inline homepage CSS into global styles and, if needed, small scoped modules for homepage-only interaction states.
- Preserve existing class names wherever it helps keep the visual output stable.
- Avoid restyling beyond what is necessary to support React state and the new in-card panel area.

### Theme handling

- Preserve current light/dark theme behavior and localStorage persistence.
- Move the theme initialization into a Next.js-friendly layout/script setup so the theme still applies early and does not flash incorrectly on load.

## Component Structure

### App-level files

- `app/layout.tsx`
- `app/page.tsx`
- `app/projects/page.tsx`
- `app/globals.css`

### Homepage components

- `components/home/HomeCard.tsx`
- `components/home/SectionNav.tsx`
- `components/home/SectionPanel.tsx`
- `components/home/sections/AboutSection.tsx`
- `components/home/sections/LinksSection.tsx`
- `components/home/sections/WorkSection.tsx`
- `components/home/sections/ProjectsSection.tsx`
- `components/home/sections/FAQSection.tsx`
- `components/home/sections/ContactSection.tsx`

### Shared data

- `data/projects.ts` or `lib/projects.ts`

This shared data source will hold migrated project content so the homepage `ProjectsSection` and fallback `/projects` route can use the same project data.

## State Model

The homepage interaction will use local React state owned by the homepage card client component.

Expected state shape:

```tsx
const [activeSection, setActiveSection] = useState<string | null>(null);
```

Behavior:

- `null` means no section is open
- a section id means that section panel is visible
- repeated clicks on the same section set the state back to `null`

## Projects Section Design

The homepage `Projects` section will absorb the content from `projects.html`, but should still respect the homepage card design language.

Practical requirements:

- project content must be accessible from the homepage
- the separate route is no longer part of the primary user journey
- the content should be modularized so future edits do not require editing a single large HTML file

The homepage version of projects does not need to recreate every layout behavior from the current `projects.html` if doing so would visually fight the homepage card. The priority is content inclusion and clean in-card interaction while staying visually consistent with the current homepage.

## Content Preservation Strategy

- Keep the exact homepage intro copy unless a small formatting change is required by JSX.
- Preserve current social icon links and destinations.
- Reuse existing project copy from `projects.html`.
- Reuse current resume and contact links.
- Do not invent new branding language or replace the personal tone of the current site.

## Implementation Sequence

1. Scaffold the Next.js project structure in the existing repository.
2. Move assets into `public/`.
3. Port homepage markup and styles into Next.js with minimal visual change.
4. Port theme behavior.
5. Extract reusable homepage components.
6. Replace homepage action buttons with the new section button set.
7. Implement idle-state section interaction on the homepage.
8. Migrate project content into shared data/components.
9. Wire the homepage `Projects` section to the migrated project content.
10. Keep a fallback `/projects` route without linking to it from the homepage.
11. Run verification to ensure the build succeeds and the homepage still matches the original look closely.

## Testing and Verification

Verification should focus on behavior preservation and style drift prevention:

- confirm Next.js build succeeds
- confirm homepage default state visually matches the current site closely
- confirm no section is open on first load
- confirm each section button opens content inside the same card
- confirm clicking the active section closes it
- confirm the theme toggle still persists across reloads
- confirm project content is available from the homepage
- confirm homepage no longer links to the projects route

## Risks and Controls

### Risk: accidental redesign during migration

Control:

- preserve existing class names and CSS values wherever possible
- only add minimal new styles for the section panel and button active states

### Risk: homepage becomes too crowded

Control:

- keep the initial state idle
- show section content only on interaction
- keep only one section open at a time

### Risk: duplicate project content between homepage and fallback route

Control:

- move project content into shared data/components instead of duplicating markup

### Risk: theme flash or incorrect initial theme

Control:

- move current theme bootstrapping logic into the Next.js layout in a way that still applies before hydration completes

## Edit Surfaces After Migration

The intended editing points after implementation are:

- homepage base copy in the homepage card component
- section-specific content in `components/home/sections/*`
- project entries in the shared project data file
- global visual behavior in `app/globals.css`

## Out of Scope

- redesigning the homepage
- changing the site's visual identity
- introducing a new navigation system
- creating a new hero layout
- copying Shar's visual language
- broad content rewriting unrelated to the migration and interaction change
