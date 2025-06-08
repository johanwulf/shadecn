import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { SVGImporter } from "@/components/SVGImporter";
import { ColorCustomizer } from "@/components/ColorCustomizer";
import { PreviewOutput } from "@/components/PreviewOutput";
import { ThemeToggle } from "@/components/ThemeToggle";

type Settings = {
  removeIds: boolean;
  react: boolean;
  removeClasses: boolean;
  removeSizing: boolean;
  format: boolean;
};

export const App = () => {
  const [svgContent, setSvgContent] = useState("");
  const [originalSvgContent, setOriginalSvgContent] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [themeMapping, setThemeMapping] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<Settings>({
    removeIds: false,
    react: true,
    removeClasses: false,
    removeSizing: false,
    format: true,
  });

  useEffect(() => {
    if (!svgContent) return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const elements = svgDoc.querySelectorAll("*");
    const detectedColors: string[] = [];

    elements.forEach((element) => {
      const fill = element.getAttribute("fill");
      const stroke = element.getAttribute("stroke");

      if (fill && fill !== "none" && !detectedColors.includes(fill)) {
        detectedColors.push(fill);
      }
      if (stroke && stroke !== "none" && !detectedColors.includes(stroke)) {
        detectedColors.push(stroke);
      }
    });

    setColors(detectedColors.filter((color) => color !== "currentColor"));
  }, [svgContent]);

  const handleSVGLoad = (content: string) => {
    setSvgContent(content);
    setOriginalSvgContent(content);
  };

  const handleColorChange = (oldColor: string, newColor: string) => {
    setSvgContent((prev) => prev.replace(new RegExp(oldColor, "g"), newColor));
  };

  const handleBulkColorChange = (colorMap: Record<string, string>) => {
    let updatedSvg = originalSvgContent;
    Object.entries(colorMap).forEach(([oldColor, newColor]) => {
      updatedSvg = updatedSvg.replace(new RegExp(oldColor, "g"), newColor);
    });
    setSvgContent(updatedSvg);
  };

  const handleReset = () => {
    setSvgContent(originalSvgContent);
  };

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "original.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="shadecn-ui-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar
            settings={settings}
            onSettingChange={handleSettingChange}
          />

          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="text-foreground" />
                  <div className="h-6 w-px bg-border" />
                  <h1 className="text-xl font-semibold text-foreground">
                    shadecn
                  </h1>
                </div>
                <ThemeToggle />
              </div>
            </header>

            <div className="flex-1 p-6 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Import and Colors */}
                <div className="space-y-6">
                  <SVGImporter onSVGLoad={handleSVGLoad} />
                  <ColorCustomizer
                    colors={colors}
                    onColorChange={handleColorChange}
                    onBulkColorChange={handleBulkColorChange}
                    onThemeMappingChange={setThemeMapping}
                  />
                </div>

                {/* Right Column - Preview and Output Combined */}
                <PreviewOutput
                  svgContent={svgContent}
                  originalSvgContent={originalSvgContent}
                  themeMapping={themeMapping}
                  settings={settings}
                  onReset={handleReset}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
};

