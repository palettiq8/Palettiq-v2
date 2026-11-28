"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function VisualizerError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-semibold">Couldn&apos;t load the visualizer</h1>

      <p className="max-w-sm text-sm text-muted-foreground">
        Something went wrong while loading this palette. Try again, or head back
        to the palette page.
      </p>

      <div className="flex items-center gap-2">
        <Button onClick={() => reset()}>Try again</Button>

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back to explore
        </Button>
      </div>
    </div>
  );
}
