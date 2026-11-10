import type { Metadata } from "next";

import PalettesExploreHeader from "@/components/Palettes/PalettesExploreHeader";
import Header from "@/components/Home/Header";
import PalettesExplorer from "@/components/Palettes/PalettesExplorer";

export const metadata: Metadata = {
  title: "Explore Color Palettes",

  description:
    "Discover and explore beautiful color palettes by color, mood, style, and industry. Find color inspiration for your next creative project.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Palettiq",
    title: "Explore Color Palettes | Palettiq",
    description:
      "Discover and explore beautiful color palettes by color, mood, style, and industry. Find color inspiration for your next creative project.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Palettiq — Explore Color Palettes",
      },
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <Header />
      <PalettesExploreHeader />
      <PalettesExplorer />
    </div>
  );
}
