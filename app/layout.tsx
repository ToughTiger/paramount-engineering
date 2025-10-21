import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paramount Engineering | Innovative Design & Engineering Solutions",
  description:
    "Paramount Engineering specializes in innovative and sustainable engineering solutions. From concept to completion, we deliver excellence in residential and commercial projects.",
  keywords:
    "engineering, paramount engineering, innovative design, sustainable projects, structural engineering, civil engineering, project management, architecture, modern design",
  authors: [{ name: "Paramount Engineering" }],
  openGraph: {
    type: "website",
    url: "https://www.paramount-engineering.com/",
    title:
      "Paramount Engineering | Innovative Design & Engineering Solutions",
    description:
      "Specializing in innovative and sustainable engineering solutions for residential and commercial projects.",
    images: [
      {
        url: "https://picsum.photos/seed/ogimage/1200/630",
        width: 1200,
        height: 630,
        alt: "Paramount Engineering OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paramount Engineering | Innovative Design & Engineering Solutions",
    description:
      "Specializing in innovative and sustainable engineering solutions for residential and commercial projects.",
    images: ["https://picsum.photos/seed/ogimage/1200/630"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts (Google Fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
    </html>
  );
}
