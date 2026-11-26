"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  useCreateProject,
  useUpdateProject,
} from "@/hooks/queries/useProjects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: {
    id: number;
    name: string;
    description: string | null;
  };
}

export default function CreateProjectDialog({
  open,
  onOpenChange,
  project,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const isEditing = !!project;
  const isPending =
    createProjectMutation.isPending || updateProjectMutation.isPending;

  function resetForm() {
    setName("");
    setDescription("");
    createProjectMutation.reset();
    updateProjectMutation.reset();
  }

  useEffect(() => {
    if (!open) return;

    setName(project?.name ?? "");
    setDescription(project?.description ?? "");

    createProjectMutation.reset();
    updateProjectMutation.reset();
  }, [open, project]);

  function handleOpenChange(value: boolean) {
    if (!value && isPending) return;

    if (!value) resetForm();

    onOpenChange(value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || isPending) return;

    try {
      if (project) {
        await updateProjectMutation.mutateAsync({
          projectId: project.id,
          name: trimmedName,
          description: trimmedDescription,
        });

        toast.success("Project updated successfully.");
      } else {
        await createProjectMutation.mutateAsync({
          name: trimmedName,
          description: trimmedDescription,
        });

        toast.success("Project created successfully.");
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? "update" : "create"} project.`,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit project" : "Create project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your project name and description."
              : "Create a project to organize and manage your saved color palettes."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>

            <Input
              id="project-name"
              placeholder="e.g. Brand Identity"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <Textarea
              id="project-description"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={3}
              className="resize-none wrap-anywhere"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
