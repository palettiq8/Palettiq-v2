import { Skeleton } from "../ui/skeleton";

export default function PaletteSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="w-full p-4">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-5 w-1/3 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-2 h-4 w-full rounded-full" />
        <Skeleton className="mt-1 h-4 w-3/4 rounded-full" />
        <div className="mt-3 flex w-full items-center justify-between">
          <Skeleton className="h-5 w-1/4 rounded-full" />
          <Skeleton className="h-5 w-1/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
