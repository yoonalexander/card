import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://alexyoon.com";
const siteDescription =
  "Software engineer focused on AI, machine learning, data products, and interactive web apps. Former Amazon and CIBC intern, McMaster Software Engineering graduate.";
const logoPath = "/assets/images/ay-logo-large-clear.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alexander Yoon",
    template: "%s | Alexander Yoon",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Alexander Yoon", url: siteUrl }],
  creator: "Alexander Yoon",
  keywords: [
    "Alexander Yoon",
    "Alex Yoon",
    "software engineer",
    "AI",
    "machine learning",
    "data products",
    "portfolio",
    "McMaster University",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: logoPath, sizes: "500x500", type: "image/png" },
      { url: "/AY Logo Large Clear.png", sizes: "500x500", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: logoPath,
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: "Alexander Yoon",
    description: siteDescription,
    siteName: "Alexander Yoon",
    images: [
      {
        url: logoPath,
        width: 500,
        height: 500,
        alt: "Alexander Yoon logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Alexander Yoon",
    description: siteDescription,
    images: [logoPath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alexander Yoon",
  alternateName: "Alex Yoon",
  url: siteUrl,
  image: `${siteUrl}${logoPath}`,
  jobTitle: "Software Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "McMaster University",
  },
  knowsAbout: ["AI", "machine learning", "data products", "web development", "software engineering"],
  sameAs: ["https://www.linkedin.com/in/yoonalex/", "https://github.com/yoonalexander"],
};

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
