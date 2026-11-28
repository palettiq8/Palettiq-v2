const LOGOS = ["Northwind", "Acme", "Vertex", "Kanso", "Orbit", "Helio"];

export function WebsiteLogos() {
  return (
    <section
      className="px-6 py-8 @lg:px-10"
      style={{
        backgroundColor: "var(--viz-background)",
        borderTop: "1px solid var(--viz-border)",
        borderBottom: "1px solid var(--viz-border)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-center text-xs font-medium tracking-wide"
          style={{ color: "var(--viz-muted)" }}
        >
          Trusted by design teams at
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-16 gap-y-4">
          {LOGOS.map((logo) => (
            <span
              key={logo}
              className="text-sm font-semibold opacity-70"
              style={{ color: "var(--viz-text)" }}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
