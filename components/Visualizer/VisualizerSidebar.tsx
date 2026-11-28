"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  ColorMapping,
  ColorRole,
  MappedColorOrigin,
  RoleSources,
  TemplateType,
  ThemeMode,
  ViewportSize,
  VisualizerColorInput,
} from "@/lib/visualizer/types";

import { ColorMappingPanel } from "./Controls/ColorMappingPanel";
import { TemplateSelector } from "./Controls/TemplateSelector";
import { ThemeSelector } from "./Controls/ThemeSelector";
import { ViewportSelector } from "./Controls/ViewportSelector";

interface VisualizerSidebarProps {
  className?: string;
  colors: ColorMapping;
  sources: RoleSources;
  origins: Record<ColorRole, MappedColorOrigin>;
  paletteColors: VisualizerColorInput[];
  hasManual: boolean;
  template: TemplateType;
  theme: ThemeMode;
  viewport: ViewportSize;
  onChangeRole: (role: ColorRole, hex: string) => void;
  onResetRole: (role: ColorRole) => void;
  onResetAll: () => void;
  onTemplateChange: (template: TemplateType) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onViewportChange: (viewport: ViewportSize) => void;
}

export function VisualizerSidebar({
  className,
  colors,
  sources,
  origins,
  paletteColors,
  hasManual,
  template,
  theme,
  viewport,
  onChangeRole,
  onResetRole,
  onResetAll,
  onTemplateChange,
  onThemeChange,
  onViewportChange,
}: VisualizerSidebarProps) {
  return (
    <aside
      className={`h-[70vh] w-full shrink-0 border-b bg-background lg:h-full lg:w-72 lg:border-b-0 lg:border-r ${className ?? ""}`}
    >
      <ScrollArea className="h-full">
        <div className="space-y-6 p-4">
          <section className="flex items-center space-x-4">
            <h2 className="text-xs font-semibold">Palette</h2>

            <div className="flex h-7 w-full overflow-hidden rounded-full border border-border/60">
              {paletteColors.map((color) => (
                <span
                  key={color.id}
                  className="flex-1"
                  style={{ backgroundColor: color.hex ?? "transparent" }}
                  title={color.hex ?? undefined}
                />
              ))}
            </div>
          </section>

          <ColorMappingPanel
            colors={colors}
            sources={sources}
            origins={origins}
            paletteColors={paletteColors}
            hasManual={hasManual}
            onChangeRole={onChangeRole}
            onResetRole={onResetRole}
            onResetAll={onResetAll}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Select a role to override its color. Roles marked Auto follow the
            palette automatically.
          </p>

          <TemplateSelector value={template} onChange={onTemplateChange} />

          <ThemeSelector value={theme} onChange={onThemeChange} />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Custom overrides apply to both Light and Dark themes.
          </p>

          {template !== "mobile" && (
            <ViewportSelector value={viewport} onChange={onViewportChange} />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
