import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/Home/Footer";
import { HideOnVisualizer } from "@/components/HideOnVisualizer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {children}
      <Suspense fallback={<Footer />}>
        <HideOnVisualizer>
          <Footer />
        </HideOnVisualizer>
      </Suspense>
    </>
  );
}
