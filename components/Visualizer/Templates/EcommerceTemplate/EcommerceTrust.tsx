import {
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Truck,
    title: "Free delivery",
    description: "On all orders over $75, worldwide.",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    description: "Change your mind? Send it back free.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Encrypted payments, always protected.",
  },
  {
    icon: Headphones,
    title: "Real support",
    description: "Humans who answer, seven days a week.",
  },
];

export function EcommerceTrust() {
  return (
    <section
      className="px-6 py-12 @lg:px-10"
      style={{ backgroundColor: "var(--viz-surface)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-6 @sm:grid-cols-2 @lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              <Icon className="size-4" />
            </span>

            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--viz-text)" }}
              >
                {title}
              </p>
              <p
                className="mt-0.5 text-[11px] leading-relaxed"
                style={{ color: "var(--viz-muted)" }}
              >
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
