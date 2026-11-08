"use client";

import Image from "next/image";
import {
  Search,
  LogOutIcon,
  BookmarkIcon,
  StarIcon,
  User2Icon,
  MessageSquareWarning,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { usePalettesExploreStore } from "@/store/usePalettesExploreStore";

export default function Header() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  const searchQuery = usePalettesExploreStore((state) => state.searchQuery);
  const setSearchQuery = usePalettesExploreStore(
    (state) => state.setSearchQuery,
  );

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="PalettIQ Logo"
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
                <DropdownMenuItem>
                  <User2Icon />
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <BookmarkIcon />
                  Saved
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <StarIcon />
                  Favorites
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  void signOut().catch(console.error);
                }}
              >
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <InputGroup className="w-xs">
          <InputGroupInput
            placeholder="Search palettes..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button size={"icon"} variant={"outline"}>
          <MessageSquareWarning />
        </Button>
        {!isLoading && !isAuthenticated && <SavePalettesDialog />}
      </div>
    </header>
  );
}
