"use client";

import { useState } from "react";
import { useCreateProject } from "@/hooks/queries/useProjects";

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
import { toast } from "sonner";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProjectMutation = useCreateProject();

  function handleOpenChange(value: boolean) {
    if (!value) {
      setName("");
      setDescription("");
    }

    onOpenChange(value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createProjectMutation.mutateAsync({
        name,
        description,
      });

      toast.success("Project created successfully.");

      onOpenChange(false);
      setName("");
      setDescription("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project.",
      );
    }
  };

  const error = createProjectMutation.error;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Create a project to organize and manage your saved color palettes.
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
              Description
              <span className="ml-1 text-muted-foreground font-normal">
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
              className="resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error.message || "Something went wrong. Please try again."}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createProjectMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || createProjectMutation.isPending}
            >
              {createProjectMutation.isPending
                ? "Creating..."
                : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
