import { Layers, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Instant theming",
    description:
      "Apply a palette across an entire interface with a single semantic token map.",
  },
  {
    icon: ShieldCheck,
    title: "Accessible by default",
    description:
      "Contrast-aware tokens keep text and actions readable in every theme.",
  },
  {
    icon: Layers,
    title: "Built to scale",
    description:
      "Compose reusable components that stay consistent as your product grows.",
  },
];

export function WebsiteFeatures() {
  return (
    <section
      className="px-6 py-14 @lg:px-10"
      style={{ backgroundColor: "var(--viz-surface)" }}
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="max-w-xl space-y-2">
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--viz-primary)" }}
          >
            Why Lumen
          </p>

          <h2
            className="text-2xl font-bold tracking-tight @lg:text-3xl"
            style={{ color: "var(--viz-text)" }}
          >
            Everything you need to ship with confidence
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            A complete workflow for turning color decisions into polished,
            production-ready interfaces.
          </p>
        </div>

        <div className="grid gap-4 @md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--viz-background)",
                borderColor: "var(--viz-border)",
              }}
            >
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "var(--viz-primary)",
                  color: "var(--viz-on-primary)",
                }}
              >
                <Icon className="size-4" />
              </span>

              <h3
                className="mt-3 text-sm font-semibold"
                style={{ color: "var(--viz-text)" }}
              >
                {title}
              </h3>

              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: "var(--viz-muted)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
