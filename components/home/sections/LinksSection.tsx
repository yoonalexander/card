const links = [
  { label: "GitHub", href: "https://github.com/yoonalexander", icon: "/assets/icons/github-logo.png" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yoonalex/", icon: "/assets/icons/linkedin-logo.png" },
  { label: "Email", href: "mailto:alexanderyoon02@gmail.com", icon: "/assets/icons/gmail-logo.png" },
  { label: "YouTube", href: "https://www.youtube.com/@protomisdev", icon: "/assets/icons/youtube-logo.png" },
  { label: "Instagram", href: "https://www.instagram.com/alex.yooon/", icon: "/assets/icons/instagram-logo.png" },
  { label: "Twitch", href: "https://www.twitch.tv/protomis", icon: "/assets/icons/twitch-logo.png" },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/y6nkbdx2s6hie39ap0m24pz8r?si=ue5ZbrmGSkOqls2iruWu5w",
    icon: "/assets/icons/spotify-logo.png",
  },
  { label: "Resume", href: "/assets/files/Alexander_Yoon_Resume_DG_2026.pdf", icon: "/assets/icons/work.png" },
  { label: "Let's Chat", href: "https://cal.com/alexyoon", icon: "/assets/icons/contacts.png" },
];

export default function LinksSection() {
  return (
    <div className="link-list">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          <img src={link.icon} alt="" aria-hidden="true" />
          <span>{link.label}</span>
        </a>
      ))}
      <p className="links-note">clicking any link opens a new tab</p>
    </div>
  );
}
