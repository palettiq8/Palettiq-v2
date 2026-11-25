import type { ReactNode } from "react";
import { Footer } from "@/components/Home/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
