import type { Metadata } from "next";
import { Chakra_Petch, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--ff-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--ff-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--ff-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QueryForge | Visual Query Builder",
  description:
    "Build complex database queries visually nested AND/OR logic, live SQL preview, and a query execution simulator.",
  authors: [{ name: "Moluno Progress", url: "https://moluno.dev" }],
  keywords: [
    "Simulated query builder",
    "visual query builder",
    "SQL preview simulator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
