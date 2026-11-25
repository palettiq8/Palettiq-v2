
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bookmark,
  Star,
  Folder,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AccountSidebarProps {
  userId: string;
}

export function AccountSidebar({ userId }: AccountSidebarProps) {
  const pathname = usePathname();
  const basePath = `/a/${userId}`;

  const workspaceItems = [
    { label: "Overview", href: basePath, icon: LayoutDashboard },
    { label: "Saved Palettes", href: `${basePath}/saved`, icon: Bookmark },
    { label: "Favorites", href: `${basePath}/favorites`, icon: Star },
    { label: "Projects", href: `${basePath}/projects`, icon: Folder },
  ];

  const preferenceItems = [
    { label: "Account Settings", href: `${basePath}/settings`, icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const Navigation = () => (
    <nav className="space-y-7 px-3 py-5">
      <div className="space-y-2">
        <p className="px-3 text-xs font-medium text-muted-foreground">
          WORKSPACE
        </p>

        <div className="space-y-1">
          {workspaceItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
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
      <aside className="hidden h-full w-64 shrink-0 overflow-hidden border-r bg-background md:block">
        <Navigation />
      </aside>

      {/* Mobile Navigation */}
      <div className="shrink-0 border-b bg-background p-3 md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Menu className="size-4" />
                Account Menu
              </Button>
            }
          />

          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle>Account</SheetTitle>
            </SheetHeader>
            <Navigation />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
