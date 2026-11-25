"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Home/Footer";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg text-center">
          <h1 className="text-8xl font-bold tracking-tighter text-foreground sm:text-9xl">
            404
          </h1>

          <h2 className="mt-6 text-xl font-semibold tracking-tight sm:text-3xl">
            Page not found!
          </h2>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft />
              Back
            </Button>

            <Button
              nativeButton={false}
              render={<Link href="/" />}
              className="w-full sm:w-auto"
            >
              Explore palettes
              <ArrowRight />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
