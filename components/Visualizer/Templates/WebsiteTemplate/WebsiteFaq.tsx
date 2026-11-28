import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "How does Lumen map my palette to roles?",
    answer:
      "We analyze hue, saturation, lightness and contrast, then assign the most suitable colors to semantic roles — reusing colors when the palette is small and generating shades only when necessary.",
  },
  {
    question: "Does it work with light and dark themes?",
    answer:
      "Yes. Each theme gets a theme-aware mapping, and any manual override you make stays visible across both.",
  },
  {
    question: "Will my original palette be modified?",
    answer:
      "Never. Visualizer changes are a separate layer; your saved palette record is untouched.",
  },
  {
    question: "Are the generated interfaces accessible?",
    answer:
      "Text and action colors are chosen with WCAG contrast in mind, and every foreground/background pair can be reviewed in Diagnostics.",
  },
  {
    question: "Can I export the tokens?",
    answer:
      "Export your semantic tokens as CSS variables, Tailwind config, or JSON to drop straight into your codebase.",
  },
  {
    question: "Can my whole team collaborate?",
    answer:
      "Shared workspaces let designers and engineers review the same token library and ship a consistent system.",
  },
];

export function WebsiteFaq() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="max-w-xl space-y-2">
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--viz-primary)" }}
          >
            FAQ
          </p>

          <h2
            className="text-2xl font-bold tracking-tight @lg:text-4xl"
            style={{ color: "var(--viz-text)" }}
          >
            Frequently asked questions
          </h2>
        </div>

        <div className="grid gap-3 @lg:grid-cols-2">
          {FAQS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border p-4"
              style={{
                backgroundColor: "var(--viz-surface)",
                borderColor: "var(--viz-border)",
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                <span style={{ color: "var(--viz-text)" }}>
                  {item.question}
                </span>

                <Plus
                  className="size-4 shrink-0 transition-transform group-open:rotate-45"
                  style={{ color: "var(--viz-muted)" }}
                />
              </summary>

              <p
                className="mt-2.5 text-xs leading-relaxed"
                style={{ color: "var(--viz-muted)" }}
              >
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
