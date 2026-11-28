import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { connection } from "next/server";

import { fetchPaletteById } from "@/lib/queries/palette-details";
import {
  getPaletteVisualizeHref,
  parsePaletteParam,
} from "@/lib/utils/palette-route";
import { PaletteVisualizer } from "@/components/Visualizer/PaletteVisualizer";
import { VisualizerSkeleton } from "@/components/Visualizer/VisualizerSkeleton";

export const metadata: Metadata = {
  title: "Palette Visualizer",
  description:
    "Preview a color palette in a realistic, live website interface.",
};

interface VisualizerPageProps {
  params: Promise<{ palette: string }>;
}

export default function VisualizerPage({ params }: VisualizerPageProps) {
  return (
    <Suspense fallback={<VisualizerSkeleton />}>
      <VisualizerContent params={params} />
    </Suspense>
  );
}

async function VisualizerContent({ params }: VisualizerPageProps) {
  await connection();

  const { palette: paletteParam } = await params;

  const parsed = parsePaletteParam(paletteParam);

  if (!parsed) {
    notFound();
  }

  const { id, slug } = parsed;

  const palette = await fetchPaletteById(id);

  if (!palette?.identity?.slug) {
    notFound();
  }

  const canonicalSlug = palette.identity.slug;

  if (slug !== canonicalSlug) {
    permanentRedirect(getPaletteVisualizeHref(id, canonicalSlug));
  }

  return <PaletteVisualizer palette={palette} />;
}
