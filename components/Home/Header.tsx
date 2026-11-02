"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Search,
  LogOutIcon,
  PaletteIcon,
  BookmarkIcon,
  StarIcon,
  User2Icon,
  Sun,
  Moon,
  Monitor,
  SunMoonIcon,
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-xl">
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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Profile"
                  />
                  <AvatarFallback>LR</AvatarFallback>
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

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SunMoonIcon />
                  Appearance
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent className="w-40">
                  <DropdownMenuRadioGroup
                    value={theme ?? "system"}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <Sun />
                      Light
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="dark">
                      <Moon />
                      Dark
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="system">
                      <Monitor />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroup className="w-xs">
          <InputGroupInput placeholder="Search palettes..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex items-center gap-3">
        <Button size={"icon"} variant={"outline"}>
          <MessageSquareWarning />
        </Button>
        <Button>
          <PaletteIcon />
          Save my palettes
        </Button>
      </div>
    </header>
  );
}
