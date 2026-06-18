import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://alexyoon.com";
const siteDescription =
  "Alexander Yoon is a software engineer who builds AI, machine learning, data, and interactive web projects. Explore his work, projects, resume, and links.";
const logoPath = "/assets/images/alexander-yoon-icon-512.png";
const icon48Path = "/assets/images/alexander-yoon-icon-48.png";
const icon192Path = "/assets/images/alexander-yoon-icon-192.png";
const contactPhotoPath = "/assets/images/me_with_cat.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alexander Yoon",
    template: "%s | Alexander Yoon",
  },
  description: siteDescription,
  applicationName: "Alexander Yoon",
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
      { url: icon48Path, sizes: "48x48", type: "image/png" },
      { url: icon192Path, sizes: "192x192", type: "image/png" },
      { url: logoPath, sizes: "512x512", type: "image/png" },
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
        width: 512,
        height: 512,
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
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alexander Yoon",
  alternateName: "Alex Yoon",
  description: siteDescription,
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
        <link rel="preload" href={contactPhotoPath} as="image" fetchPriority="high" />
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
        <SpeedInsights />
      </body>
    </html>
  );
}
