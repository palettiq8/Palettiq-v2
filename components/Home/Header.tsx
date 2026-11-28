"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOutIcon,
  BookmarkIcon,
  StarIcon,
  User2Icon,
  MessageSquareWarning,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import SavePalettesDialog from "@/components/Auth/SavePalettesDialog";
import { ThemeToggle } from "../ThemeToggle";
import { toast } from "sonner";
import { HeaderSearch, HeaderFilters } from "./HeaderNavigation";

export default function Header() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();

  return (
    <Suspense fallback={null}>
      <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Link href={"/"}>
            <Image
              src="/logo.svg"
              alt="Palettiq Logo"
              width={32}
              height={32}
              priority
            />
          </Link>
          {!isLoading && isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage
                        src={user.user_metadata?.avatar_url ?? ""}
                        alt="Profile"
                      />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={!user}
                    render={<Link href={user ? `/a/${user.id}` : "#"} />}
                  >
                    <User2Icon />
                    Account
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={<Link href={user ? `/a/${user.id}/saved` : "#"} />}
                  >
                    <BookmarkIcon />
                    Saved
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={
                      <Link href={user ? `/a/${user.id}/favorites` : "#"} />
                    }
                  >
                    <StarIcon />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    void signOut()
                      .then(() => {
                        // Leave the authenticated area; the account layout is
                        // server-rendered, so navigating away is required.
                        router.push("/");
                        router.refresh();
                      })
                      .catch(() => {
                        toast.error("Failed to sign out. Please try again.");
                      });
                  }}
                >
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <HeaderSearch />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0">
            <Link href={"/"}>
              <Button variant={"ghost"}>Palettes</Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size={"icon"} variant={"outline"}>
              <MessageSquareWarning />
            </Button>
            {!isLoading && !isAuthenticated && <SavePalettesDialog />}
            <HeaderFilters />
          </div>
        </div>
      </header>
    </Suspense>
  );
}
