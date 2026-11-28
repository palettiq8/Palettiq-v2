export interface ParsedPaletteParam {
  id: number;
  slug: string;
}

export function parsePaletteParam(value: string): ParsedPaletteParam | null {
  const separatorIndex = value.indexOf("-");

  if (separatorIndex === -1) return null;

  const id = Number(value.slice(0, separatorIndex));
  const slug = value.slice(separatorIndex + 1);

  if (!Number.isSafeInteger(id) || id <= 0 || !slug) return null;

  return { id, slug };
}

export function getPaletteHref(id: number, slug: string) {
  return `/palettes/${id}-${slug}`;
}

export function getPaletteVisualizeHref(id: number, slug: string) {
  return `/palettes/${id}-${slug}/visualize`;
}

export function isPaletteVisualizerPath(pathname: string) {
  return /\/palettes\/[^/]+\/visualize\/?$/.test(pathname);
}
