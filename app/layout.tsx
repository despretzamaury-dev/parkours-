import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PARKOURS HUB | Plateforme de Tutorat",
  description: "Plateforme interactive de tutorat pour la gestion des devoirs, le carnet de notes, la boutique de récompenses et le classement des élèves.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${plusJakarta.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-[#FAF7F2] text-black flex flex-col selection:bg-[#FF4D00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
