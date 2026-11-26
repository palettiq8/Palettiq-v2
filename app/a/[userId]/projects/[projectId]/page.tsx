"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  Palette as PaletteIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { useProjects, useDeleteProject } from "@/hooks/queries/useProjects";
import {
  useNormalSavedPalettes,
  useProjectPalettes,
  useRemovePaletteFromProject,
  useDeleteAllPalettesFromProject,
} from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteActions } from "@/hooks/usePaletteActions";

import { PaletteGrid } from "@/components/Palettes/PaletteGrid";
import { PalettePagination } from "@/components/Palettes/PalettePagination";
import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";
import CreateProjectDialog from "@/components/Projects/CreateProjectDialog";
import PaletteSkeleton from "@/components/Palettes/PaletteSkeleton";

const PAGE_SIZE = 30;

export default function ProjectPage() {
  const params = useParams<{
    userId: string;
    projectId: string;
  }>();

  const router = useRouter();

  const projectId = Number(params.projectId);
  const isValidProjectId = Number.isInteger(projectId) && projectId > 0;

  const [page, setPage] = useState(1);

  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
  );

  const [addToProjectsOpen, setAddToProjectsOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deletePalettesOpen, setDeletePalettesOpen] = useState(false);

  const {
    data: projects = [],
    isPending: isProjectsPending,
    isError: isProjectsError,
    error: projectsError,
  } = useProjects();

  const project = projects.find((item) => item.id === projectId);

  const { data: normalSavedPaletteIds = [], isPending: isSavedIdsPending } =
    useNormalSavedPalettes();

  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const { data, isPending, isError, error } = useProjectPalettes(
    projectId,
    page,
    PAGE_SIZE,
  );

  const palettes = data?.palettes ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const {
    handleToggleNormalSave,
    handleToggleFavorite,
    handleAddToProjects,
    handleDownloadPalette,
    savingPaletteId,
    favoritingPaletteId,
  } = usePaletteActions(normalSavedPaletteIds, favoritePaletteIds);

  const removePaletteMutation = useRemovePaletteFromProject();
  const deleteAllPalettesMutation = useDeleteAllPalettesFromProject();
  const deleteProjectMutation = useDeleteProject();

  const isDeletingProject = deleteProjectMutation.isPending;
  const isDeletingPalettes = deleteAllPalettesMutation.isPending;

  useEffect(() => {
    if (!data) return;

    if (page > Math.max(1, totalPages)) {
      setPage(Math.max(1, totalPages));
    }
  }, [data, page, totalPages]);

  const openAddToProjects = async (paletteId: number) => {
    const authenticated = await handleAddToProjects(paletteId);

    if (!authenticated) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

  const handleRemovePalette = async (paletteId: number): Promise<void> => {
    try {
      await removePaletteMutation.mutateAsync({
        paletteId,
        projectId,
      });

      toast.success("Palette removed from project");
    } catch (error) {
      console.error("Failed to remove palette:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to remove palette",
      );

      throw error;
    }
  };

  const handleDeleteAllPalettes = async () => {
    if (isDeletingPalettes) return;

    try {
      await deleteAllPalettesMutation.mutateAsync(projectId);

      setDeletePalettesOpen(false);
      setPage(1);

      toast.success("All palettes removed from project");
    } catch (error) {
      console.error("Failed to delete project palettes:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete project palettes",
      );
    }
  };

  const handleDeleteProject = async () => {
    if (isDeletingProject) return;

    try {
      await deleteProjectMutation.mutateAsync(projectId);

      toast.success("Project deleted successfully");

      setDeleteProjectOpen(false);

     router.replace(`/a/${params.userId}`);
    } catch (error) {
      console.error("Failed to delete project:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete project",
      );
    }
  };

  if (!isValidProjectId) {
    return <p className="text-sm text-destructive">Invalid project ID.</p>;
  }

  if (isProjectsPending || isPending || isSavedIdsPending) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <PaletteSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isProjectsError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load project: {projectsError.message}
      </p>
    );
  }

  if (!project) {
    return <p className="text-sm text-muted-foreground">Project not found.</p>;
  }

  if (isError && !data) {
    return (
      <p className="text-sm text-destructive">
        Failed to load project palettes: {error.message}
      </p>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold">{project.name}</h1>

          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label="Project options"
              >
                <EllipsisVertical />
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setEditProjectOpen(true)}>
              <Pencil />
              Edit project
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeletePalettesOpen(true)}
            >
              <Trash2 />
              Remove palettes
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteProjectOpen(true)}
            >
              <Trash2 />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {palettes.length === 0 ? (
        <div className="grid w-full place-content-center">
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PaletteIcon />
              </EmptyMedia>

              <EmptyTitle>No palettes in this project yet</EmptyTitle>

              <EmptyDescription>
                Palettes you add to this project will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <>
          <PaletteGrid
            palettes={palettes}
            favoritePaletteIds={favoritePaletteIds}
            normalSavedPaletteIds={normalSavedPaletteIds}
            savingPaletteId={savingPaletteId}
            favoritingPaletteId={favoritingPaletteId}
            onToggleFavorite={handleToggleFavorite}
            onToggleSave={handleToggleNormalSave}
            onDownload={handleDownloadPalette}
            onAddToProjects={openAddToProjects}
            hideExploreSimilar
            showDelete
            onRemove={handleRemovePalette}
          />

          <PalettePagination
            page={page}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            onPageChange={(nextPage) => {
              setPage(nextPage);

              document.getElementById("account-content")?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        </>
      )}

      {selectedPaletteId !== null && (
        <AddToProjectsDialog
          paletteId={selectedPaletteId}
          open={addToProjectsOpen}
          onOpenChange={(open) => {
            setAddToProjectsOpen(open);

            if (!open) {
              setSelectedPaletteId(null);
            }
          }}
        />
      )}

      <CreateProjectDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={project}
      />

      <AlertDialog
        open={deletePalettesOpen}
        onOpenChange={(open) => {
          if (!isDeletingPalettes) setDeletePalettesOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove all palettes?</AlertDialogTitle>

            <AlertDialogDescription>
              All palettes will be removed from this project. Your original
              palettes and this project will not be deleted. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPalettes}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingPalettes}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteAllPalettes();
              }}
            >
              {isDeletingPalettes ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteProjectOpen}
        onOpenChange={(open) => {
          if (!isDeletingProject) setDeleteProjectOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete this project and all palettes saved
              inside it. Your original palettes will remain in your account.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingProject}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingProject}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteProject();
              }}
            >
              {isDeletingProject ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
