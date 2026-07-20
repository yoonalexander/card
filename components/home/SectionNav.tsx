import type { SectionId } from "./SectionPanel";
import { sections } from "./SectionPanel";

const sectionIcons: Record<SectionId, string> = {
  about: "about",
  work: "work",
  projects: "projects",
  faq: "faq",
  contact: "contacts",
};

type SectionNavProps = {
  openSections: SectionId[];
  onOpen: (sectionId: SectionId) => void;
  isDark: boolean;
};

export default function SectionNav({ openSections, onOpen, isDark }: SectionNavProps) {
  return (
    <div className="btn-container">
      {sections.map((section) => (
        <button
          className={`section-launcher${openSections.includes(section.id) ? " section-button-active" : ""}`}
          key={section.id}
          type="button"
          onClick={() => onOpen(section.id)}
          aria-pressed={openSections.includes(section.id)}
        >
          <img
            src={`/assets/icons/${sectionIcons[section.id]}${isDark ? "-white" : ""}.svg`}
            alt=""
            aria-hidden="true"
          />
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  );
}
