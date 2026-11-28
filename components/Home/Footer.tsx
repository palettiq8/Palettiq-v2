"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiInstagram, SiPinterest } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import { FooterBrand } from "./FooterBrand";
import { Button } from "@/components/ui/button";

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "About us", href: "/about" },
  { label: "Settings", href: "/settings" },
  { label: "Help center", href: "/help" },
  { label: "Feedback", href: "/feedback" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-background mt-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_0.9fr_0.8fr] lg:gap-16 lg:py-16">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Palettiq home"
              className="inline-flex items-center gap-2"
            >
              <Image
                src="/logo.svg"
                alt="Palettiq Logo"
                width={28}
                height={28}
                priority
              />
              <span className="text-xl font-semibold tracking-tight select-none">
                Palettiq
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A better way to explore colors, build thoughtful color systems,
              and bring your creative ideas to life.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-5 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold">Follow us</h3>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Color inspiration and creative ideas, wherever you create.
            </p>

            <div className="mt-4 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={
                  <a
                    href="https://www.instagram.com/palett.iq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  />
                }
              >
                <SiInstagram className="size-4.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={
                  <a
                    href="https://www.pinterest.com/palettiq8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Pinterest"
                  />
                }
              >
                <SiPinterest className="size-4.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year ?? "2026"} Palettiq. All rights reserved.</p>

          <p>Made for people who love color.</p>
        </div>

        {/* Oversized Brand */}
        <div className="py-4 w-full">
          <FooterBrand text="PALETTIQ" />
        </div>
      </div>
    </footer>
  );
}
