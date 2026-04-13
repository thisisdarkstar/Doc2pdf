import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "DocToPDF | Convert Web Docs to PDF & Markdown",
  description:
    "DocToPDF converts documentation websites into downloadable PDF and Markdown files. Paste a docs URL, export web docs to PDF or MD, and download the finished files instantly.",
  keywords: [
    "DocToPDF",
    "web documentation to pdf",
    "web documentation to markdown",
    "web docs to pdf",
    "web docs to markdown",
    "documentation to markdown",
    "webpage to markdown",
    "documentation export",
    "pdf generator",
    "markdown exporter",
    "docs site converter",
    "download docs as pdf",
    "website documentation to pdf",
    "website documentation to markdown",
  ],
  metadataBase: new URL("https://webdoctopdf.vercel.app"),
  applicationName: "DocToPDF",
  creator: "DocToPDF",
  publisher: "DocToPDF",
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#4f46e5",
  alternates: {
    canonical: "https://webdoctopdf.vercel.app",
  },
  openGraph: {
    title: "DocToPDF | Convert Web Docs to PDF & Markdown",
    description:
      "Convert documentation websites into PDF and Markdown files with DocToPDF. Paste any docs URL, export to PDF or MD, and download the output quickly.",
    url: "https://webdoctopdf.vercel.app",
    siteName: "DocToPDF",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "DocToPDF logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocToPDF | Convert Web Docs to PDF & Markdown",
    description:
      "Convert documentation websites into PDF and Markdown files with DocToPDF. Paste any docs URL, export to PDF or MD, and download the output quickly.",
    images: ["/favicon.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
