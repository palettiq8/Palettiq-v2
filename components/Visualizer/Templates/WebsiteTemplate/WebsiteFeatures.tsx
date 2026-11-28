import { Layers, ShieldCheck, Users, Wand2, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
}

const FEATURES: Feature[] = [
  {
    icon: Wand2,
    title: "Token generation",
    description:
      "Turn any palette into semantic tokens for every surface and state, automatically.",
    tag: "Automation",
  },
  {
    icon: ShieldCheck,
    title: "Accessibility built in",
    description:
      "Contrast-aware text and action colors keep every screen readable by default.",
    tag: "A11y",
  },
  {
    icon: Layers,
    title: "Composable system",
    description:
      "A coherent color, type and spacing scale that holds up across products.",
    tag: "System",
  },
  {
    icon: Users,
    title: "Team ready",
    description:
      "Share, review and ship the same design language across the whole team.",
    tag: "Collaboration",
  },
];

export function WebsiteFeatures() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-3 @lg:flex-row @lg:items-end @lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--viz-primary)" }}
            >
              The platform
            </p>

            <h2
              className="text-2xl font-bold tracking-tight @lg:text-4xl"
              style={{ color: "var(--viz-text)" }}
            >
              A complete system, not just swatches
            </h2>
          </div>

          <p
            className="max-w-sm text-sm leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            Everything you need to move from a raw palette to a shipped,
            consistent interface.
          </p>
        </div>

        <div className="grid gap-4 @md:grid-cols-2 @xl:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, tag }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--viz-surface)",
                borderColor: "var(--viz-border)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "var(--viz-primary)",
                    color: "var(--viz-on-primary)",
                  }}
                >
                  <Icon className="size-5" />
                </span>

                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: "var(--viz-accent)",
                    color: "var(--viz-on-accent)",
                  }}
                >
                  {tag}
                </span>
              </div>

              <h3
                className="mt-4 text-sm font-semibold"
                style={{ color: "var(--viz-text)" }}
              >
                {title}
              </h3>

              <p
                className="mt-1.5 text-xs leading-relaxed"
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
