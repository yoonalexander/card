import type { SectionId } from "./SectionPanel";
import { sections } from "./SectionPanel";

const sectionIcons: Record<SectionId, string> = {
  about: "/assets/icons/about.png",
  links: "/assets/icons/links.png",
  work: "/assets/icons/work.png",
  projects: "/assets/icons/projects.png",
  faq: "/assets/icons/faq.png",
  contact: "/assets/icons/contacts.png",
};

type SectionNavProps = {
  openSections: SectionId[];
  onOpen: (sectionId: SectionId) => void;
};

export default function SectionNav({ openSections, onOpen }: SectionNavProps) {
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
          <img src={sectionIcons[section.id]} alt="" aria-hidden="true" />
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  );
}
