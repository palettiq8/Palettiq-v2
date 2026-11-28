type OrderStatus = "Paid" | "Pending" | "Refunded";

interface Order {
  name: string;
  email: string;
  initials: string;
  plan: string;
  amount: string;
  status: OrderStatus;
}

const ORDERS: Order[] = [
  {
    name: "Sara Ahmed",
    email: "sara@northwind.io",
    initials: "SA",
    plan: "Pro",
    amount: "$29.00",
    status: "Paid",
  },
  {
    name: "Michael Chen",
    email: "michael@vertex.co",
    initials: "MC",
    plan: "Studio",
    amount: "$79.00",
    status: "Paid",
  },
  {
    name: "Emily Davis",
    email: "emily@kanso.app",
    initials: "ED",
    plan: "Pro",
    amount: "$29.00",
    status: "Pending",
  },
  {
    name: "Omar Haddad",
    email: "omar@orbit.dev",
    initials: "OH",
    plan: "Starter",
    amount: "$0.00",
    status: "Refunded",
  },
  {
    name: "Lina Park",
    email: "lina@helio.io",
    initials: "LP",
    plan: "Studio",
    amount: "$79.00",
    status: "Paid",
  },
];

function statusStyle(status: OrderStatus) {
  if (status === "Paid") {
    return {
      backgroundColor: "color-mix(in oklch, var(--viz-primary) 16%, transparent)",
      color: "var(--viz-primary)",
    };
  }

  if (status === "Pending") {
    return {
      backgroundColor: "color-mix(in oklch, var(--viz-accent) 18%, transparent)",
      color: "var(--viz-accent)",
    };
  }

  return {
    backgroundColor: "color-mix(in oklch, var(--viz-muted) 18%, transparent)",
    color: "var(--viz-muted)",
  };
}

export function DashboardTable() {
  return (
    <section
      className="rounded-2xl border"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderColor: "var(--viz-border)",
      }}
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--viz-text)" }}
          >
            Recent orders
          </h3>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--viz-muted)" }}>
            Latest payments this week
          </p>
        </div>

        <span
          className="cursor-default text-[11px] font-semibold"
          style={{ color: "var(--viz-primary)" }}
        >
          View all
        </span>
      </div>

      <div className="mt-4">
        <div
          className="flex items-center gap-3 border-t px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            borderColor: "var(--viz-border)",
            color: "var(--viz-muted)",
          }}
        >
          <span className="flex-1">Customer</span>
          <span className="hidden w-16 @sm:block">Plan</span>
          <span className="w-16 text-right">Amount</span>
          <span className="w-20 text-center">Status</span>
        </div>

        {ORDERS.map((order) => (
          <div
            key={order.email}
            className="flex items-center gap-3 border-t px-5 py-3"
            style={{ borderColor: "var(--viz-border)" }}
          >
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              {order.initials}
            </span>

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-medium"
                style={{ color: "var(--viz-text)" }}
              >
                {order.name}
              </p>
              <p
                className="truncate text-[10px]"
                style={{ color: "var(--viz-muted)" }}
              >
                {order.email}
              </p>
            </div>

            <span
              className="hidden w-16 text-xs @sm:block"
              style={{ color: "var(--viz-muted)" }}
            >
              {order.plan}
            </span>

            <span
              className="w-16 text-right text-xs font-semibold"
              style={{ color: "var(--viz-text)" }}
            >
              {order.amount}
            </span>

            <span className="w-20 text-center">
              <span
                className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={statusStyle(order.status)}
              >
                {order.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
