import { Brain, Menu } from "lucide-react";

const NAV_LINKS = ["Product", "Solutions", "Resources", "Pricing"];

export function WebsiteNavbar() {
  return (
    <header
      className="flex items-center justify-between gap-4 border-b px-6 py-3 @lg:px-10"
      style={{
        backgroundColor: "var(--viz-background)",
        borderColor: "var(--viz-border)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex size-8 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--viz-primary)",
            color: "var(--viz-on-primary)",
          }}
        >
          <Brain className="size-4" />
        </span>

        <span
          className="text-base font-semibold tracking-tight"
          style={{ color: "var(--viz-text)" }}
        >
          Lumen
        </span>
      </div>

      <nav className="hidden items-center gap-7 text-sm @md:flex">
        {NAV_LINKS.map((link) => (
          <span
            key={link}
            className="cursor-default opacity-80 transition-opacity hover:opacity-100"
            style={{ color: "var(--viz-muted)" }}
          >
            {link}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <span
          className="hidden cursor-default text-sm @sm:inline"
          style={{ color: "var(--viz-text)" }}
        >
          Sign in
        </span>

        <span
          className="cursor-default rounded-lg px-3.5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--viz-primary)",
            color: "var(--viz-on-primary)",
          }}
        >
          Get started
        </span>

        <Menu className="size-5 @md:hidden" style={{ color: "var(--viz-text)" }} />
      </div>
    </header>
  );
}
