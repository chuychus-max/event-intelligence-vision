import type { Metadata } from "next";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/ibm-plex-mono/300.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Intelligence · ShipbayOS",
  description:
    "Visión de ShipbayOS para la inteligencia de recintos y eventos en vivo en México: gemelo digital, copiloto de operación y medición de spots comerciales.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
