import { Search, ShoppingBag, Store, Truck, User } from "lucide-react";

const NAV_LINKS = ["Shop", "Collections", "New in", "Sale"];

export function EcommerceNavbar() {
  return (
    <>
      <div
        className="flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-medium"
        style={{
          backgroundColor: "var(--viz-primary)",
          color: "var(--viz-on-primary)",
        }}
      >
        <Truck className="size-3.5" />
        Free shipping over $75 · 30-day returns
      </div>

      <header
        className="flex items-center justify-between gap-4 border-b px-6 py-4 @lg:px-10"
        style={{
          backgroundColor: "var(--viz-background)",
          borderColor: "var(--viz-border)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "var(--viz-primary)",
              color: "var(--viz-on-primary)",
            }}
          >
            <Store className="size-4" />
          </span>

          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: "var(--viz-text)" }}
          >
            Aurelia
          </span>
        </div>

        <nav className="hidden items-center gap-7 text-sm @md:flex">
          {NAV_LINKS.map((link) => (
            <span
              key={link}
              className="cursor-default opacity-90 transition-opacity hover:opacity-100"
              style={{
                color:
                  link === "Sale"
                    ? "var(--viz-accent)"
                    : "var(--viz-muted)",
              }}
            >
              {link}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Search className="size-5" style={{ color: "var(--viz-muted)" }} />
          <User
            className="hidden size-5 @sm:block"
            style={{ color: "var(--viz-muted)" }}
          />

          <span
            className="relative cursor-default"
            style={{ color: "var(--viz-text)" }}
          >
            <ShoppingBag className="size-5" />
            <span
              className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full text-[9px] font-bold"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              2
            </span>
          </span>
        </div>
      </header>
    </>
  );
}
