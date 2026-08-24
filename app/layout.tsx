import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yufei Jiao — Creative Technologist",
  description:
    "Yufei Jiao is a London-based creative technologist working across realtime interaction, computer vision, physical computing and data art.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
