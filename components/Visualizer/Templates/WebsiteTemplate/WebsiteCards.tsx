interface ResultCard {
  tag: string;
  metric: string;
  title: string;
  description: string;
  visual: "bars" | "segments" | "rings";
}

const CARDS: ResultCard[] = [
  {
    tag: "Brand refresh",
    metric: "+38%",
    title: "Activation after a brand pass",
    description:
      "A cohesive palette lifted sign-up completion within the first month.",
    visual: "bars",
  },
  {
    tag: "Design system",
    metric: "2.4×",
    title: "Faster feature delivery",
    description:
      "Shared tokens removed guesswork and repeated design decisions.",
    visual: "segments",
  },
  {
    tag: "Accessibility",
    metric: "100%",
    title: "Text pairs passing AA",
    description:
      "Every surface is contrast-checked automatically before release.",
    visual: "rings",
  },
];

const BAR_HEIGHTS = [42, 58, 36, 72, 64, 88, 76];

function ResultVisual({ visual }: { visual: ResultCard["visual"] }) {
  if (visual === "bars") {
    return (
      <div className="flex h-20 items-end gap-1.5">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${height}%`,
              backgroundColor:
                height > 60 ? "var(--viz-primary)" : "var(--viz-border)",
            }}
          />
        ))}
      </div>
    );
  }

  if (visual === "segments") {
    return (
      <div className="space-y-3">
        <div className="flex h-16 overflow-hidden rounded-lg">
          <span className="w-1/2" style={{ backgroundColor: "var(--viz-primary)" }} />
          <span className="w-1/4" style={{ backgroundColor: "var(--viz-secondary)" }} />
          <span className="w-1/6" style={{ backgroundColor: "var(--viz-accent)" }} />
          <span className="w-1/12" style={{ backgroundColor: "var(--viz-border)" }} />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            "var(--viz-primary)",
            "var(--viz-secondary)",
            "var(--viz-accent)",
            "var(--viz-border)",
          ].map((color) => (
            <span
              key={color}
              className="size-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-20 items-center justify-center">
      <div
        className="flex size-20 items-center justify-center rounded-full border-8"
        style={{ borderColor: "var(--viz-primary)" }}
      >
        <div
          className="flex size-11 items-center justify-center rounded-full border-4"
          style={{ borderColor: "var(--viz-accent)" }}
        >
          <div
            className="size-4 rounded-full"
            style={{ backgroundColor: "var(--viz-secondary)" }}
          />
        </div>
      </div>
    </div>
  );
}

export function WebsiteCards() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-surface)" }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-3 @lg:flex-row @lg:items-end @lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--viz-primary)" }}
            >
              Proven results
            </p>

            <h2
              className="text-2xl font-bold tracking-tight @lg:text-4xl"
              style={{ color: "var(--viz-text)" }}
            >
              From palette to shipped product
            </h2>
          </div>

          <p
            className="max-w-sm text-sm leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            Real teams, real outcomes — measured after adopting a shared color
            system.
          </p>
        </div>

        <div className="grid gap-4 @md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: "var(--viz-background)",
                borderColor: "var(--viz-border)",
              }}
            >
              <div className="space-y-2 p-5">
                <span
                  className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: "var(--viz-accent)",
                    color: "var(--viz-on-accent)",
                  }}
                >
                  {card.tag}
                </span>

                <p
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--viz-primary)" }}
                >
                  {card.metric}
                </p>

                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--viz-text)" }}
                >
                  {card.title}
                </h3>

                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--viz-muted)" }}
                >
                  {card.description}
                </p>
              </div>

              <div
                className="mt-auto border-t p-4"
                style={{
                  borderColor: "var(--viz-border)",
                  backgroundColor: "var(--viz-surface)",
                }}
              >
                <ResultVisual visual={card.visual} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
