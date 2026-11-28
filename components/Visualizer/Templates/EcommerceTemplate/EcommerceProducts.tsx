import { Plus, Star } from "lucide-react";

type Badge = "New" | "Sale" | "Bestseller";

interface Product {
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  rating: number;
  badge?: Badge;
  variant: 0 | 1 | 2;
}

const PRODUCTS: Product[] = [
  {
    name: "Aura Lounge Chair",
    category: "Furniture",
    price: "$349",
    rating: 4.8,
    badge: "Bestseller",
    variant: 0,
  },
  {
    name: "Terra Ceramic Vase",
    category: "Decor",
    price: "$68",
    oldPrice: "$89",
    rating: 4.6,
    badge: "Sale",
    variant: 1,
  },
  {
    name: "Linea Table Lamp",
    category: "Lighting",
    price: "$124",
    rating: 4.9,
    badge: "New",
    variant: 2,
  },
  {
    name: "Nova Wool Throw",
    category: "Textiles",
    price: "$95",
    rating: 4.7,
    variant: 0,
  },
  {
    name: "Orbit Wall Clock",
    category: "Decor",
    price: "$72",
    rating: 4.5,
    variant: 2,
  },
  {
    name: "Moss Planter Set",
    category: "Decor",
    price: "$54",
    rating: 4.4,
    variant: 1,
  },
];

const FILTERS = ["All", "New", "Sale", "Under $100"];

function ProductVisual({
  variant,
  badge,
}: {
  variant: Product["variant"];
  badge?: Badge;
}) {
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-xl border"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderColor: "var(--viz-border)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {variant === 0 && (
          <>
            <span
              className="block size-28 rounded-full"
              style={{ backgroundColor: "var(--viz-primary)", opacity: 0.16 }}
            />
            <span
              className="absolute size-16 rounded-2xl"
              style={{ backgroundColor: "var(--viz-accent)" }}
            />
          </>
        )}

        {variant === 1 && (
          <>
            <span
              className="block size-24 rounded-3xl"
              style={{ backgroundColor: "var(--viz-secondary)" }}
            />
            <span
              className="absolute -right-3 -top-2 size-12 rounded-full"
              style={{ backgroundColor: "var(--viz-primary)", opacity: 0.25 }}
            />
          </>
        )}

        {variant === 2 && (
          <>
            <span
              className="block size-20 rounded-full"
              style={{ backgroundColor: "var(--viz-primary)", opacity: 0.15 }}
            />
            <span
              className="absolute h-28 w-16 rounded-full"
              style={{ backgroundColor: "var(--viz-accent)" }}
            />
          </>
        )}
      </div>

      {badge && (
        <span
          className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            backgroundColor:
              badge === "Sale"
                ? "var(--viz-accent)"
                : "var(--viz-primary)",
            color:
              badge === "Sale"
                ? "var(--viz-on-accent)"
                : "var(--viz-on-primary)",
          }}
        >
          {badge}
        </span>
      )}

      <span
        className="absolute bottom-2.5 right-2.5 flex size-8 cursor-default items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--viz-primary)",
          color: "var(--viz-on-primary)",
        }}
      >
        <Plus className="size-4" />
      </span>
    </div>
  );
}

export function EcommerceProducts() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2
              className="text-2xl font-bold tracking-tight @lg:text-3xl"
              style={{ color: "var(--viz-text)" }}
            >
              Bestsellers
            </h2>
            <p className="text-sm" style={{ color: "var(--viz-muted)" }}>
              Pieces our customers come back for.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter, index) => (
              <span
                key={filter}
                className="cursor-default rounded-full border px-3 py-1.5 text-xs font-medium"
                style={
                  index === 0
                    ? {
                        backgroundColor: "var(--viz-primary)",
                        borderColor: "var(--viz-primary)",
                        color: "var(--viz-on-primary)",
                      }
                    : {
                        borderColor: "var(--viz-border)",
                        color: "var(--viz-muted)",
                      }
                }
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-x-4 gap-y-8 @sm:grid-cols-2 @lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <div key={product.name}>
              <ProductVisual variant={product.variant} badge={product.badge} />

              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className="truncate text-xs font-semibold"
                    style={{ color: "var(--viz-text)" }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--viz-muted)" }}
                  >
                    {product.category}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold">
                    <span style={{ color: "var(--viz-text)" }}>
                      {product.price}
                    </span>
                    {product.oldPrice && (
                      <span
                        className="ml-1 text-[11px] font-normal line-through"
                        style={{ color: "var(--viz-muted)" }}
                      >
                        {product.oldPrice}
                      </span>
                    )}
                  </p>

                  <span
                    className="mt-0.5 inline-flex items-center gap-1 text-[10px]"
                    style={{ color: "var(--viz-muted)" }}
                  >
                    <Star
                      className="size-3"
                      style={{ color: "var(--viz-accent)" }}
                      fill="currentColor"
                    />
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
