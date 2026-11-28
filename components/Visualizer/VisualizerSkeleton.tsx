import { Skeleton } from "@/components/ui/skeleton";

export function VisualizerSkeleton() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/20">
      <div className="flex h-14 items-center justify-between border-b bg-background px-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-52" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full space-y-3 border-b bg-background p-4 lg:w-72 lg:border-b-0 lg:border-r">
          <Skeleton className="h-4 w-20" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>

        <div className="flex-1 p-4">
          <Skeleton className="h-full min-h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
