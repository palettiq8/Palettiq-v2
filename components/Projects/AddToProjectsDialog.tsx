"use client";

import { useEffect, useState } from "react";
import { Plus, Search, FolderOpen } from "lucide-react";

import { useProjects } from "@/hooks/queries/useProjects";
import { useSavePaletteToProjects } from "@/hooks/queries/usePaletteSaves";

import CreateProjectDialog from "./CreateProjectDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
    if (selectedProjectIds.length === 0) return;

    try {
      const result = await saveMutation.mutateAsync({
        paletteId,
        projectIds: selectedProjectIds,
      });

      const { addedProjectIds, alreadyAddedProjects } = result;

      const addedCount = addedProjectIds.length;
      const existingProjects = alreadyAddedProjects;

      if (addedCount > 0 && existingProjects.length > 0) {
        const projectNames = existingProjects
          .map((project) => `"${project.name}"`)
          .join(", ");

        toast.success(
          `Added to ${addedCount} project(s). Already exists in: ${projectNames}.`,
        );
      } else if (addedCount > 0) {
        onSaved?.();
      } else if (existingProjects.length > 0) {
        const projectNames = existingProjects
          .map((project) => `"${project.name}"`)
          .join(", ");

        toast.info(`This palette is already added to ${projectNames}.`);
      }

      onOpenChange(false);
    } catch (e) {
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
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          {/* Header */}
          <DialogHeader className="border-b p-5 text-left">
            <DialogTitle>Add to projects</DialogTitle>
            <DialogDescription>
              Select the projects where you want to save this palette.
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-4 p-5">
            {/* Search and Create */}
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

            {/* Project List */}
            <div className="max-h-64 min-h-32 overflow-y-auto">
              {isPending ? (
                <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                  Loading projects...
                </div>
              ) : isError ? (
                <div className="flex min-h-32 items-center justify-center text-sm text-destructive">
                  Failed to load projects. Please try again.
                </div>
              ) : projects.length === 0 ? (
                <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
                  <FolderOpen className="size-8 text-muted-foreground" />

                  <p className="text-sm font-medium">
                    {search.trim() ? "No projects found" : "No projects yet"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {search.trim()
                      ? "Try searching with another name."
                      : "Create a project to organize your palettes."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {projects.map((project) => {
                    const checked = selectedProjectIds.includes(project.id);

                    return (
                      <label
                        key={project.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:bg-muted/60 has-data-[state=checked]:border-border has-data-[state=checked]:bg-muted/40"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleProject(project.id)}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {project.name}
                          </p>

                          {project.description && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {saveMutation.error && (
              <p className="text-sm text-destructive">
                {saveMutation.error.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t p-4 sm:justify-between">
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
                // disabled={
                //   selectedProjectIds.length === 0 || saveMutation.isPending
                // }
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
