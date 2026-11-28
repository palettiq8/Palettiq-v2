const FOOTER_COLUMNS = [
  { title: "Product", links: ["Features", "Templates", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Docs", "Guides", "Support", "Status"] },
];

const LEGAL_LINKS = ["Privacy", "Terms", "Cookies"];

export function WebsiteFooter() {
  return (
    <footer
      className="px-6 py-10 @lg:px-10"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderTop: "1px solid var(--viz-border)",
      }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-8 @md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="flex size-7 items-center justify-center rounded-md text-xs font-bold"
                style={{
                  backgroundColor: "var(--viz-primary)",
                  color: "var(--viz-on-primary)",
                }}
              >
                L
              </span>

              <span
                className="text-sm font-semibold"
                style={{ color: "var(--viz-text)" }}
              >
                Lumen
              </span>
            </div>

            <p
              className="max-w-xs text-xs leading-relaxed"
              style={{ color: "var(--viz-muted)" }}
            >
              Design systems and color workflows for teams who care about the
              details.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-2">
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--viz-text)" }}
              >
                {column.title}
              </p>

              <ul className="space-y-1.5">
                {column.links.map((link) => (
                  <li
                    key={link}
                    className="cursor-default text-xs transition-opacity hover:opacity-70"
                    style={{ color: "var(--viz-muted)" }}
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col items-center justify-between gap-2 border-t pt-4 text-[11px] @sm:flex-row"
          style={{
            borderColor: "var(--viz-border)",
            color: "var(--viz-muted)",
          }}
        >
          <span>© 2026 Lumen. All rights reserved.</span>

          <div className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <span
                key={link}
                className="cursor-default transition-opacity hover:opacity-70"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
