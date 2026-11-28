"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function VisualizerNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-semibold">Palette not found</h1>

      <p className="max-w-sm text-sm text-muted-foreground">
        This palette doesn&apos;t exist or is no longer available.
      </p>

      <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
        Back to explore
      </Button>
    </div>
  );
}
