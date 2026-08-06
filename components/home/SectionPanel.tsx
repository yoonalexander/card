import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";
import FAQSection from "./sections/FAQSection";
import ProjectsSection from "./sections/ProjectsSection";
import WorkSection from "./sections/WorkSection";

export type SectionId = "about" | "work" | "projects" | "faq" | "contact";

export const sections: Array<{ id: SectionId; label: string }> = [
  { id: "about", label: "About" },
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
  onCatSecretClick?: () => void;
  onLogoSecretClick?: () => void;
  isSecretFlowerVisible?: boolean;
};

export default function SectionPanel({
  sectionId,
  onOpenProjectDemo,
  onCatSecretClick,
  onLogoSecretClick,
  isSecretFlowerVisible = false,
}: SectionPanelProps) {
  if (sectionId === "about") {
    return (
      <AboutSection
        onLogoSecretClick={onLogoSecretClick}
        isSecretFlowerVisible={isSecretFlowerVisible}
      />
    );
  }
  if (sectionId === "work") return <WorkSection />;
  if (sectionId === "projects") return <ProjectsSection onOpenProjectDemo={onOpenProjectDemo} />;
  if (sectionId === "faq") return <FAQSection />;
  return <ContactSection onCatSecretClick={onCatSecretClick} />;
}
