import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";
import FAQSection from "./sections/FAQSection";
import LinksSection from "./sections/LinksSection";
import ProjectsSection from "./sections/ProjectsSection";
import WorkSection from "./sections/WorkSection";

export type SectionId = "about" | "links" | "work" | "projects" | "faq" | "contact";

export const sections: Array<{ id: SectionId; label: string }> = [
  { id: "about", label: "About" },
  { id: "links", label: "Links" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export function getSectionTitle(sectionId: SectionId) {
  return sections.find((section) => section.id === sectionId)?.label ?? "Section";
}

type SectionPanelProps = {
  sectionId: SectionId;
  onOpenProjectDemo?: (projectName: string) => void;
};

export default function SectionPanel({ sectionId, onOpenProjectDemo }: SectionPanelProps) {
  if (sectionId === "about") return <AboutSection />;
  if (sectionId === "links") return <LinksSection />;
  if (sectionId === "work") return <WorkSection />;
  if (sectionId === "projects") return <ProjectsSection onOpenProjectDemo={onOpenProjectDemo} />;
  if (sectionId === "faq") return <FAQSection />;
  return <ContactSection />;
}
