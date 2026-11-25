import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { connection } from "next/server";

import {
  fetchPaletteById,
  fetchSimilarPalettes,
} from "@/lib/queries/palette-details";

import { PaletteHero } from "@/components/Palettes/Details/PaletteHero";
import { PaletteColorBreakdown } from "@/components/Palettes/Details/PaletteColorBreakdown";
import { PaletteAbout } from "@/components/Palettes/Details/PaletteAbout";
import { PaletteCharacteristics } from "@/components/Palettes/Details/PaletteCharacteristics";
import { PaletteDesignContext } from "@/components/Palettes/Details/PaletteDesignContext";
import { PaletteDetailsSkeleton } from "@/components/Palettes/Details/PaletteDetailsSkeleton";
import { SimilarPalettes } from "@/components/Palettes/Details/SimilarPalettes";

interface PaletteDetailsPageProps {
  params: Promise<{
    palette: string;
  }>;
}

export default function PaletteDetailsPage({
  params,
}: PaletteDetailsPageProps) {
  return (
    <Suspense fallback={<PaletteDetailsSkeleton />}>
      <PaletteDetailsContent params={params} />
    </Suspense>
  );
}

async function PaletteDetailsContent({ params }: PaletteDetailsPageProps) {
  await connection();

  const { palette: paletteParam } = await params;

  const separatorIndex = paletteParam.indexOf("-");

  if (separatorIndex === -1) {
    notFound();
  }

  const id = Number(paletteParam.slice(0, separatorIndex));
  const slug = paletteParam.slice(separatorIndex + 1);

  if (!Number.isSafeInteger(id) || id <= 0 || !slug) {
    notFound();
  }

  const paletteData = await fetchPaletteById(id);

  if (!paletteData?.identity?.slug) {
    notFound();
  }

  const canonicalSlug = paletteData.identity.slug;

  if (slug !== canonicalSlug) {
    permanentRedirect(`/palettes/${id}-${canonicalSlug}`);
  }

  const similarPalettes = await fetchSimilarPalettes(id);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 sm:px-6 sm:py-6 lg:px-8">
      <PaletteHero palette={paletteData} />
      <PaletteColorBreakdown colors={paletteData.colors} />
      <PaletteAbout identity={paletteData.identity} />
      <PaletteCharacteristics filters={paletteData.filters} />
      <PaletteDesignContext filters={paletteData.filters} />
      <SimilarPalettes palettes={similarPalettes} />
    </main>
  );
}
