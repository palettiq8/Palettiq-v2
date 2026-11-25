import type { PaletteDetails } from "@/lib/queries/palette-details";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PaletteDesignContextProps {
  filters: PaletteDetails["filters"];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

function formatValue(value: string) {
  return value.replaceAll("-", " ");
}

export function PaletteDesignContext({ filters }: PaletteDesignContextProps) {
  if (!isRecord(filters)) return null;

  const groups = [
    {
      title: "Creative direction",
      description: "The feelings and meanings behind the palette.",
      items: [
        { label: "Moods", values: getStringArray(filters.moods) },
        { label: "Emotions", values: getStringArray(filters.emotions) },
        {
          label: "Psychologies",
          values: getStringArray(filters.psychologies),
        },
      ],
    },
    {
      title: "Design application",
      description: "Where and how the palette can be applied.",
      items: [
        { label: "Use cases", values: getStringArray(filters.use_cases) },
        { label: "Industries", values: getStringArray(filters.industries) },
      ],
    },
    {
      title: "Visual style",
      description: "The aesthetic direction and visual themes.",
      items: [
        { label: "Styles", values: getStringArray(filters.styles) },
        { label: "Themes", values: getStringArray(filters.themes) },
      ],
    },
    {
      title: "Seasonal & historical context",
      description:
        "The seasons and historical influences associated with the palette.",
      items: [
        { label: "Seasons", values: getStringArray(filters.seasons) },
        { label: "Eras", values: getStringArray(filters.eras) },
      ],
    },
  ];

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.values.length > 0),
    }))
    .filter((group) => group.items.length > 0);

  if (visibleGroups.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Section Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Design context</h2>

        <p className="text-sm text-muted-foreground">
          Discover the moods, styles, and creative applications that define this
          palette.
        </p>
      </div>

      <Separator />

      {/* Context Groups */}
      <div className="grid gap-6 lg:grid-cols-2">
        {visibleGroups.map((group) => (
          <div
            key={group.title}
            className="overflow-hidden rounded-2xl border bg-card"
          >
            {/* Card Header */}
            <div className="space-y-1 border-b bg-muted/30 px-5 py-4">
              <h3 className="text-sm font-semibold tracking-tight">
                {group.title}
              </h3>

              <p className="text-xs text-muted-foreground">
                {group.description}
              </p>
            </div>

            {/* Context Properties */}
            <div className="divide-y divide-border/60 px-5">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <span className="shrink-0 pt-0.5 text-sm text-muted-foreground">
                    {item.label}
                  </span>

                  <div className="flex max-w-[65%] flex-wrap justify-end gap-1.5">
                    {item.values.map((value) => (
                      <Badge key={value} variant="outline">
                        {formatValue(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
