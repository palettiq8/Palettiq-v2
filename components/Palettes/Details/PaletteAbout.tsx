import type { PaletteDetails } from "@/lib/queries/palette-details";
import { Separator } from "@/components/ui/separator";

interface PaletteAboutProps {
  identity: PaletteDetails["identity"];
}

export function PaletteAbout({ identity }: PaletteAboutProps) {
  const longDescription = identity?.long_description?.trim();
  const story = identity?.story?.trim();

  if (!longDescription && !story) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          About this palette
        </h2>

        <p className="text-sm text-muted-foreground">
          Discover the inspiration, ideas, and story behind this color palette.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
        {longDescription && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Overview</h3>

            <p className="text-sm leading-7 text-muted-foreground">
              {longDescription}
            </p>
          </div>
        )}

        {story && (
          <div className="space-y-3 md:border-l md:border-border md:pl-8">
            <h3 className="text-sm font-semibold">The story</h3>

            <p className="text-sm leading-7 text-muted-foreground">{story}</p>
          </div>
        )}
      </div>
    </section>
  );
}
