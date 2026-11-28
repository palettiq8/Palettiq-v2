"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Redo2, RotateCcw, SlidersHorizontal, Undo2, View } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Palette } from "@/lib/types";
import { getPaletteHref } from "@/lib/utils/palette-route";

interface VisualizerHeaderProps {
  palette: Palette;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canReset: boolean;
  onReset: () => void;
  controlsOpen: boolean;
  onToggleControls: () => void;
}

export function VisualizerHeader({
  palette,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  canReset,
  onReset,
  controlsOpen,
  onToggleControls,
}: VisualizerHeaderProps) {
  const paletteHref = getPaletteHref(palette.id, palette.identity?.slug ?? "");
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const router = useRouter();

  function handleBack() {
    // Go back to wherever the user came from (explore, details, profile, ...).
    // Fall back to the palette details page for direct/refreshed visits.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(paletteHref);
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Go back"
          title="Go back"
          onClick={handleBack}
        >
          <ArrowLeft />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label={controlsOpen ? "Hide controls" : "Show controls"}
          aria-expanded={controlsOpen}
          title="Controls"
          onClick={onToggleControls}
        >
          <SlidersHorizontal />
        </Button>

        <span className="hidden text-sm font-semibold sm:inline">Palettiq</span>
        <span className="hidden text-muted-foreground sm:inline">/</span>

        <span className="truncate text-sm font-medium">
          {palette.identity?.name ?? "Untitled palette"}
        </span>

        <Badge variant={"secondary"} className="text-muted-foreground">
          Visualizer
        </Badge>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <ThemeToggle />

        <Button
          variant="outline"
          size="icon"
          disabled={!canUndo}
          onClick={onUndo}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={!canRedo}
          onClick={onRedo}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 />
        </Button>

        <Button
          variant="outline"
          size="default"
          disabled={!canReset}
          onClick={() => setConfirmResetOpen(true)}
          title="Reset visualizer"
        >
          <RotateCcw />
          <span className="hidden sm:inline">Reset</span>
        </Button>

        <Button
          variant="outline"
          size="default"
          nativeButton={false}
          title="View details"
          render={<Link href={paletteHref} />}
        >
          <View />
          <span className="hidden sm:inline">View details</span>
        </Button>
      </div>

      <AlertDialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset visualizer?</AlertDialogTitle>

            <AlertDialogDescription>
              This restores the automatic color mapping and the default
              template, theme, and viewport. Your manual overrides will be
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                onReset();
                setConfirmResetOpen(false);
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
