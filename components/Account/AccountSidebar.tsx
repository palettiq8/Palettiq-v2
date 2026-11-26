"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bookmark,
  Star,
  Folder,
  Settings,
  Menu,
  Plus,
  ChevronDown,
} from "lucide-react";

import { cn } from "cn";
import { useProjects } from "@/hooks/queries/useProjects";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import CreateProjectDialog from "@/components/Projects/CreateProjectDialog";

interface AccountSidebarProps {
  userId: string;
}

interface NavigationProps {
  onNavigate?: () => void;
  onCreateProject: () => void;
}

export function AccountSidebar({ userId }: AccountSidebarProps) {
  const pathname = usePathname();
  const basePath = `/a/${userId}`;

  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    data: projects = [],
    isPending: isProjectsPending,
    isError: isProjectsError,
  } = useProjects();

  const libraryItems = [
    { label: "Overview", href: basePath, icon: LayoutDashboard },
    { label: "Saved", href: `${basePath}/saved`, icon: Bookmark },
    { label: "Favorites", href: `${basePath}/favorites`, icon: Star },
  ];

  const preferenceItems = [
    { label: "Settings", href: `${basePath}/settings`, icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const projectsActive = pathname.startsWith(`${basePath}/projects`);

  const handleCreateProject = () => {
    setMobileMenuOpen(false);
    setCreateProjectOpen(true);
  };

  const Navigation = ({ onNavigate, onCreateProject }: NavigationProps) => (
    <nav className="space-y-7 px-3 py-5">
      <div className="space-y-2">
        <p className="px-3 text-xs font-medium text-muted-foreground">
          LIBRARY
        </p>

        <div className="space-y-1">
          {libraryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-full px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Projects */}
          <div className="space-y-1">
            <div
              className={cn(
                "flex h-10 items-center rounded-full transition-colors",
                projectsActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <button
                type="button"
                onClick={() => setProjectsExpanded((previous) => !previous)}
                aria-expanded={projectsExpanded}
                className="flex h-full min-w-0 flex-1 items-center gap-3 rounded-full px-3 text-left text-sm font-medium"
              >
                <Folder className="size-4 shrink-0" />
                <span>Projects</span>

                <span className="flex-1" />

                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    projectsExpanded && "rotate-180",
                  )}
                />
              </button>

              <button
                type="button"
                onClick={onCreateProject}
                aria-label="Create project"
                className="mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {projectsExpanded && (
              <div className="ml-5 space-y-1 border-l pl-2">
                {isProjectsPending ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    Loading projects...
                  </p>
                ) : isProjectsError ? (
                  <p className="px-2 py-2 text-xs text-destructive">
                    Failed to load projects.
                  </p>
                ) : projects.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    No projects yet.
                  </p>
                ) : (
                  projects.map((project) => {
                    const href = `${basePath}/projects/${project.id}`;
                    const active = pathname === href;

                    return (
                      <Link
                        key={project.id}
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-secondary font-medium text-secondary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {project.name}
                        </span>

                        <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-medium tabular-nums">
                          {project.paletteCount}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="px-3 text-xs font-medium text-muted-foreground">
          PREFERENCES
        </p>

        <div className="space-y-1">
          {preferenceItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-full px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 border-r bg-background md:block">
        <ScrollArea className="h-full w-full">
          <Navigation onCreateProject={() => setCreateProjectOpen(true)} />
        </ScrollArea>
      </aside>

      {/* Mobile Navigation */}
      <div className="shrink-0 border-b bg-background p-3 md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Menu className="size-4" />
                Account Menu
              </Button>
            }
          />

          <SheetContent side="left" className="w-72 overflow-hidden p-0">
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle>Account</SheetTitle>
            </SheetHeader>

            <ScrollArea className="h-[calc(100%-73px)]">
              <Navigation
                onNavigate={() => setMobileMenuOpen(false)}
                onCreateProject={handleCreateProject}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
      />
    </>
  );
}
