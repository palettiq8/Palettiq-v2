import { Skeleton } from "@/components/ui/skeleton";

function VisualizerSidebarSkeleton() {
  return (
    <aside className="h-[70vh] w-full shrink-0 border-b bg-background lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
      <div className="space-y-6 p-4">
        {/* Palette strip */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-7 flex-1 rounded-full" />
        </div>

        {/* Color mapping */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>

          <div className="space-y-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-1.5 py-1.5"
              >
                <Skeleton className="size-7 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2.5 w-12" />
                </div>
                <Skeleton className="h-4 w-9 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>

        {/* Viewport */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </aside>
  );
}

function VisualizerPreviewSkeleton() {
  return (
    <section className="min-h-0 min-w-0 flex-1 p-3 sm:p-4">
      <div className="mx-auto flex w-full max-w-300 flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
        {/* Browser chrome */}
        <div className="flex h-9 shrink-0 items-center gap-1.5 border-b bg-muted/40 px-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <Skeleton className="ml-2 h-2.5 w-16 rounded-full" />
        </div>

        {/* Mock website */}
        <div className="@container space-y-6 p-5 sm:p-6">
          {/* Navbar */}
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-24 rounded-md" />
            <div className="hidden gap-3 @md:flex">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>

          {/* Hero */}
          <div className="grid items-center gap-6 @md:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>

          {/* Feature cards */}
          <div className="grid gap-3 @md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2 rounded-xl border p-4"
              >
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function VisualizerSkeleton() {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-muted/20">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-4xl" />
          <Skeleton className="hidden h-4 w-16 sm:block" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="flex items-center gap-1.5">
          <Skeleton className="size-9 rounded-4xl" />
          <Skeleton className="size-9 rounded-4xl" />
          <Skeleton className="size-9 rounded-4xl" />
          <Skeleton className="h-9 w-24 rounded-4xl" />
          <Skeleton className="hidden h-9 w-28 rounded-4xl sm:block" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <VisualizerSidebarSkeleton />
        <VisualizerPreviewSkeleton />
      </div>
    </div>
  );
}
