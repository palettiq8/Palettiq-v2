import { DashboardActivity } from "./DashboardActivity";
import { DashboardBreakdown } from "./DashboardBreakdown";
import { DashboardChart } from "./DashboardChart";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTable } from "./DashboardTable";
import { DashboardTopbar } from "./DashboardTopbar";

export function DashboardTemplate() {
  return (
    <div
      className="flex min-h-full flex-1"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />

        <div className="flex-1 space-y-4 p-4 @lg:p-6">
          <DashboardMetrics />

          <div className="grid gap-4 @xl:grid-cols-[1.7fr_1fr]">
            <DashboardChart />
            <DashboardBreakdown />
          </div>

          <div className="grid gap-4 @xl:grid-cols-[1.7fr_1fr]">
            <DashboardTable />
            <DashboardActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
