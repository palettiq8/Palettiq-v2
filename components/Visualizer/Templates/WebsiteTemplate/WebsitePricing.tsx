import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/month",
    description: "For individuals exploring a palette.",
    features: ["1 project", "Community palettes", "Light & dark preview", "CSS export"],
    featured: false,
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/month",
    description: "For product teams shipping a system.",
    features: [
      "Unlimited projects",
      "Shared token library",
      "Contrast diagnostics",
      "Team review",
    ],
    featured: true,
    cta: "Start free trial",
  },
  {
    name: "Studio",
    price: "$79",
    cadence: "/month",
    description: "For agencies delivering brands.",
    features: ["Client workspaces", "Custom templates", "Priority support", "SSO & roles"],
    featured: false,
    cta: "Talk to sales",
  },
];

export function WebsitePricing() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-surface)" }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="mx-auto max-w-xl space-y-2 text-center">
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--viz-primary)" }}
          >
            Pricing
          </p>

          <h2
            className="text-2xl font-bold tracking-tight @lg:text-4xl"
            style={{ color: "var(--viz-text)" }}
          >
            Simple, transparent pricing
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            Start free, scale when your team does. No hidden fees.
          </p>
        </div>

        <div className="grid items-start gap-4 @md:grid-cols-3">
          {PLANS.map((plan) => {
            const titleColor = plan.featured
              ? "var(--viz-on-primary)"
              : "var(--viz-text)";
            const bodyColor = plan.featured
              ? "var(--viz-on-primary)"
              : "var(--viz-muted)";

            return (
              <div
                key={plan.name}
                className="flex flex-col rounded-2xl border p-6"
                style={
                  plan.featured
                    ? {
                        backgroundColor: "var(--viz-primary)",
                        borderColor: "var(--viz-primary)",
                      }
                    : {
                        backgroundColor: "var(--viz-background)",
                        borderColor: "var(--viz-border)",
                      }
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: titleColor }}
                  >
                    {plan.name}
                  </span>

                  {plan.featured && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: "var(--viz-on-primary)",
                        color: "var(--viz-primary)",
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: titleColor }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-xs" style={{ color: bodyColor }}>
                    {plan.cadence}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-relaxed" style={{ color: bodyColor }}>
                  {plan.description}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: titleColor }}
                    >
                      <Check
                        className="mt-0.5 size-3.5 shrink-0"
                        style={{
                          color: plan.featured
                            ? "var(--viz-on-primary)"
                            : "var(--viz-primary)",
                        }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <span
                  className="mt-6 cursor-default rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90"
                  style={
                    plan.featured
                      ? {
                          backgroundColor: "var(--viz-on-primary)",
                          color: "var(--viz-primary)",
                        }
                      : {
                          backgroundColor: "var(--viz-primary)",
                          color: "var(--viz-on-primary)",
                        }
                  }
                >
                  {plan.cta}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
