export function WebsiteCta() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-primary)" }}
    >
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2
          className="text-2xl font-bold tracking-tight @lg:text-3xl"
          style={{ color: "var(--viz-on-primary)" }}
        >
          Bring your palette to life
        </h2>

        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--viz-on-primary)", opacity: 0.85 }}
        >
          Preview your colors in a real interface and ship a design system your
          team can trust.
        </p>

        <div className="flex justify-center pt-1">
          <span
            className="cursor-default rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--viz-on-primary)",
              color: "var(--viz-primary)",
            }}
          >
            Open the visualizer
          </span>
        </div>
      </div>
    </section>
  );
}
