import { ArrowUpRight, LayoutTemplate } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Templates", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "Support", "Status"],
  },
];

const LEGAL_LINKS = ["Privacy", "Terms", "Cookies"];

export function WebsiteFooter() {
  return (
    <footer
      className="px-6 py-12 @lg:px-10"
      style={{
        backgroundColor: "var(--viz-text)",
        color: "var(--viz-background)",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="grid gap-10 @md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="flex size-7 items-center justify-center rounded-md"
                style={{
                  backgroundColor: "var(--viz-primary)",
                  color: "var(--viz-on-primary)",
                }}
              >
                <LayoutTemplate className="size-4" />
              </span>

              <span
                className="text-sm font-semibold"
                style={{ color: "var(--viz-background)" }}
              >
                Lumen
              </span>
            </div>

            <p
              className="max-w-xs text-xs leading-relaxed"
              style={{ color: "var(--viz-background)", opacity: 0.7 }}
            >
              Design systems and color workflows for teams who care about the
              details.
            </p>

            <div className="flex max-w-xs items-center gap-2 pt-1">
              <div
                className="flex-1 rounded-lg border px-3 py-2 text-xs"
                style={{
                  borderColor:
                    "color-mix(in oklch, var(--viz-background) 25%, transparent)",
                  color: "var(--viz-background)",
                  opacity: 0.85,
                }}
              >
                you@company.com
              </div>

              <span
                className="cursor-default rounded-lg px-3 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--viz-accent)",
                  color: "var(--viz-on-accent)",
                }}
              >
                Join
              </span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-2.5">
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--viz-background)" }}
              >
                {column.title}
              </p>

              <ul className="space-y-1.5">
                {column.links.map((link) => (
                  <li
                    key={link}
                    className="cursor-default text-xs transition-opacity hover:opacity-100"
                    style={{ color: "var(--viz-background)", opacity: 0.7 }}
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col items-center justify-between gap-3 border-t pt-5 text-[11px] @sm:flex-row"
          style={{
            borderColor:
              "color-mix(in oklch, var(--viz-background) 20%, transparent)",
            color: "var(--viz-background)",
            opacity: 0.7,
          }}
        >
          <span>© 2026 Lumen. All rights reserved.</span>

          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <span key={link} className="cursor-default hover:opacity-100">
                {link}
              </span>
            ))}

            <span
              className="flex size-7 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
