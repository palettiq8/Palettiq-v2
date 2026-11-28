"use client";

import type { CSSProperties } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { buildPreviewTokenStyle } from "@/lib/visualizer/preview-tokens";
import type {
  ColorMapping,
  TemplateType,
  ThemeMode,
  ViewportSize,
} from "@/lib/visualizer/types";

import { DashboardTemplate } from "./Templates/DashboardTemplate/DashboardTemplate";
import { EcommerceTemplate } from "./Templates/EcommerceTemplate/EcommerceTemplate";
import { MobileAppTemplate } from "./Templates/MobileAppTemplate/MobileAppTemplate";
import { WebsiteTemplate } from "./Templates/WebsiteTemplate/WebsiteTemplate";

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 390,
};

interface VisualizerPreviewProps {
  colors: ColorMapping;
  template: TemplateType;
  theme: ThemeMode;
  viewport: ViewportSize;
}

function renderTemplate(template: TemplateType) {
  switch (template) {
    case "dashboard":
      return <DashboardTemplate />;
    case "ecommerce":
      return <EcommerceTemplate />;
    case "mobile":
      return <MobileAppTemplate />;
    case "website":
    default:
      return <WebsiteTemplate />;
  }
}

export function VisualizerPreview({
  colors,
  template,
  theme,
  viewport,
}: VisualizerPreviewProps) {
  const tokenStyle = buildPreviewTokenStyle(colors);
  const width = VIEWPORT_WIDTHS[viewport];
  const isMobile = template === "mobile";

  return (
    <section className="min-h-0 min-w-0 flex-1">
      <ScrollArea className="h-full w-full">
        <div className="p-3 sm:p-4">
          <div
            className={`mx-auto flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm ${
              isMobile ? "w-full" : "transition-[width] duration-300"
            }`}
            style={isMobile ? undefined : { width }}
          >
            <div className="flex h-9 shrink-0 items-center gap-1.5 border-b bg-muted/40 px-3">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-green-400/70" />
              <span className="ml-2 truncate text-[11px] text-muted-foreground">
                {isMobile ? "Mobile UI" : viewport}
              </span>
            </div>
            
            <div
              className="@container flex min-h-115 flex-1 flex-col transition-colors duration-200 **:transition-colors **:duration-200"
              data-viz-theme={theme}
              style={
                {
                  ...tokenStyle,
                  colorScheme: theme,
                  backgroundColor: "var(--viz-background)",
                  color: "var(--viz-text)",
                } as CSSProperties
              }
            >
              {renderTemplate(template)}
            </div>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}
