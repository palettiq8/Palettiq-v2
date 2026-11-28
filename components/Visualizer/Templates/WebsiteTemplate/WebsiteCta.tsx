import { ArrowRight } from "lucide-react";

export function WebsiteCta() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-primary)" }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-medium"
          style={{
            backgroundColor: "var(--viz-on-primary)",
            color: "var(--viz-primary)",
          }}
        >
          Ready when you are
        </span>

        <h2
          className="text-2xl font-bold tracking-tight @lg:text-4xl"
          style={{ color: "var(--viz-on-primary)" }}
        >
          Bring your palette to life
        </h2>

        <p
          className="max-w-xl text-sm leading-relaxed"
          style={{ color: "var(--viz-on-primary)", opacity: 0.85 }}
        >
          Preview your colors in a real interface, tune every role, and ship a
          design system your team can trust.
        </p>

        <span
          className="inline-flex cursor-default items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--viz-on-primary)",
            color: "var(--viz-primary)",
          }}
        >
          Open the visualizer
          <ArrowRight className="size-4" />
        </span>
      </div>
    </section>
  );
}
