import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Lumen gave our product a visual language overnight. What used to take weeks now ships in an afternoon.",
    name: "Sara Ahmed",
    role: "Head of Design, Northwind",
    initials: "SA",
  },
  {
    quote:
      "The contrast-aware tokens are the quiet hero. Accessibility stopped being a last-minute scramble.",
    name: "Michael Chen",
    role: "Frontend Lead, Vertex",
    initials: "MC",
  },
  {
    quote:
      "Our brand finally feels consistent everywhere. Customers noticed before we even announced it.",
    name: "Emily Davis",
    role: "Founder, Kanso",
    initials: "ED",
  },
];

export function WebsiteTestimonials() {
  return (
    <section
      className="px-6 py-16 @lg:px-10"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-xl space-y-2">
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--viz-primary)" }}
          >
            What teams say
          </p>

          <h2
            className="text-2xl font-bold tracking-tight @lg:text-4xl"
            style={{ color: "var(--viz-text)" }}
          >
            Loved by the people who ship
          </h2>
        </div>

        <div className="grid gap-4 @md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--viz-surface)",
                borderColor: "var(--viz-border)",
              }}
            >
              <Quote
                className="size-6"
                style={{ color: "var(--viz-primary)" }}
              />

              <div
                className="mt-3 flex items-center gap-1"
                style={{ color: "var(--viz-accent)" }}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-3" fill="currentColor" />
                ))}
              </div>

              <blockquote
                className="mt-3 flex-1 text-sm leading-relaxed"
                style={{ color: "var(--viz-text)" }}
              >
                “{item.quote}”
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-2.5">
                <span
                  className="flex size-9 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--viz-primary)",
                    color: "var(--viz-on-primary)",
                  }}
                >
                  {item.initials}
                </span>

                <div className="min-w-0">
                  <p
                    className="truncate text-xs font-semibold"
                    style={{ color: "var(--viz-text)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="truncate text-[11px]"
                    style={{ color: "var(--viz-muted)" }}
                  >
                    {item.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
