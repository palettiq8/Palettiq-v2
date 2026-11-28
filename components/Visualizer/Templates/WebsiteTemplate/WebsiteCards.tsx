import { Check } from "lucide-react";

interface PlanCard {
  label: string;
  title: string;
  description: string;
  points: string[];
  featured: boolean;
}

const PLANS: PlanCard[] = [
  {
    label: "Starter",
    title: "For individuals",
    description: "Explore palettes and preview them in a live interface.",
    points: ["1 project", "Community palettes", "Light & dark preview"],
    featured: false,
  },
  {
    label: "Pro",
    title: "For product teams",
    description: "Build shared design systems and preview every direction.",
    points: ["Unlimited projects", "Shared tokens", "Diagnostics preview"],
    featured: true,
  },
  {
    label: "Studio",
    title: "For agencies",
    description: "Deliver consistent brand systems across every client.",
    points: ["Team workspaces", "Custom templates", "Priority support"],
    featured: false,
  },
];

export function WebsiteCards() {
  return (
    <section
      className="px-6 py-14 @lg:px-10"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <h2
            className="text-2xl font-bold tracking-tight @lg:text-3xl"
            style={{ color: "var(--viz-text)" }}
          >
            Simple, transparent plans
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            Choose the plan that fits how your team works.
          </p>
        </div>

        <div className="grid gap-4 @md:grid-cols-3">
          {PLANS.map((plan) => {
            const titleColor = plan.featured
              ? "var(--viz-on-primary)"
              : "var(--viz-text)";
            const bodyColor = plan.featured
              ? "var(--viz-on-primary)"
              : "var(--viz-muted)";

            return (
              <div
                key={plan.label}
                className="flex flex-col rounded-2xl border p-5"
                style={
                  plan.featured
                    ? {
                        backgroundColor: "var(--viz-primary)",
                        borderColor: "var(--viz-primary)",
                      }
                    : {
                        backgroundColor: "var(--viz-surface)",
                        borderColor: "var(--viz-border)",
                      }
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: bodyColor }}>
                    {plan.label}
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

                <h3
                  className="mt-3 text-lg font-bold"
                  style={{ color: titleColor }}
                >
                  {plan.title}
                </h3>

                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: bodyColor }}
                >
                  {plan.description}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: bodyColor }}
                    >
                      <Check
                        className="mt-0.5 size-3.5 shrink-0"
                        style={{
                          color: plan.featured
                            ? "var(--viz-on-primary)"
                            : "var(--viz-primary)",
                        }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <span
                  className="mt-5 cursor-default rounded-lg px-3 py-2 text-center text-sm font-medium transition-opacity hover:opacity-90"
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
                  Get started
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
