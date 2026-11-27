"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { useProjects } from "@/hooks/queries/useProjects";
import { useSavePaletteToProjects } from "@/hooks/queries/usePaletteSaves";

import CreateProjectDialog from "./CreateProjectDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/EmptyState";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddToProjectsDialogProps {
  paletteId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export default function AddToProjectsDialog({
  paletteId,
  open,
  onOpenChange,
  onSaved,
}: AddToProjectsDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const { data: projects = [], isPending, isError } = useProjects(search, open);

  const saveMutation = useSavePaletteToProjects();

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedProjectIds([]);
    }
  }, [open]);

  function toggleProject(projectId: number) {
    setSelectedProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
  }

  async function handleAdd() {
    if (selectedProjectIds.length === 0 || saveMutation.isPending) return;

    saveMutation.reset();

    try {
      const { addedProjectIds, alreadyAddedProjects } =
        await saveMutation.mutateAsync({
          paletteId,
          projectIds: selectedProjectIds,
        });

      const addedCount = addedProjectIds.length;

      if (addedCount > 0) {
        onSaved?.();
      }

      if (addedCount > 0 && alreadyAddedProjects.length > 0) {
        const projectNames = alreadyAddedProjects
          .map((project) => `"${project.name}"`)
          .join(", ");

        toast.success(
          `Added to ${addedCount} project(s). Already exists in: ${projectNames}.`,
        );
      } else if (addedCount > 0) {
        toast.success(`Added to ${addedCount} project(s).`);
      } else if (alreadyAddedProjects.length > 0) {
        const projectNames = alreadyAddedProjects
          .map((project) => `"${project.name}"`)
          .join(", ");

        toast.info(`This palette is already added to ${projectNames}.`);
      }

      onOpenChange(false);
    } catch {
      // Mutation error is displayed in the dialog.
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value && saveMutation.isPending) return;
    onOpenChange(value);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1.5">
              <DialogTitle>Add to projects</DialogTitle>
              <DialogDescription>
                Select the projects where you want to save this palette.
              </DialogDescription>
            </div>

            <DialogClose
              render={
                <Button variant="outline" size="icon">
                  <X className="size-4" />
                  <span className="sr-only">Close</span>
                </Button>
              }
            />
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                aria-label="Create project"
                onClick={() => setCreateProjectOpen(true)}
              >
                <Plus />
              </Button>
            </div>

            <ScrollArea className="min-h-max max-h-64">
              <div className="min-h-32">
                {isPending ? (
                  <div className="flex h-32 items-center justify-center">
                    <Spinner />
                  </div>
                ) : isError ? (
                  <div className="flex h-32 items-center justify-center text-sm text-destructive">
                    Failed to load projects!
                  </div>
                ) : projects.length === 0 ? (
                  <EmptyState
                    icon={FolderOpen}
                    title={
                      search.trim() ? "No projects found" : "No projects yet"
                    }
                    description={
                      search.trim()
                        ? "Try searching with another name."
                        : "Create a project to organize your palettes."
                    }
                  />
                ) : (
                  <div className="space-y-1">
                    {projects.map((project) => {
                      const checked = selectedProjectIds.includes(project.id);

                      return (
                        <label
                          key={project.id}
                          className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/60"
                        >
                          <Checkbox
                            className="shrink-0"
                            checked={checked}
                            onCheckedChange={() => toggleProject(project.id)}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {project.name}
                            </p>

                            {project.description && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {project.description}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-medium tabular-nums">
                            {project.paletteCount}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>

            {saveMutation.error && (
              <p className="text-sm text-destructive" role="alert">
                {saveMutation.error.message}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <p className="self-center text-xs text-muted-foreground">
              {selectedProjectIds.length} selected
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saveMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                onClick={handleAdd}
                disabled={
                  selectedProjectIds.length === 0 || saveMutation.isPending
                }
              >
                {saveMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
      />
    </>
  );
}
