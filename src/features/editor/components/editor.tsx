"use client";

import * as fabric from "fabric";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

import { ResponseType } from "@/features/projects/api/use-get-project";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

import { 
  ActiveTool, 
  selectionDependentTools
} from "@/features/editor/types";
import { Navbar } from "@/features/editor/components/navbar";
import { Footer } from "@/features/editor/components/footer";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { ShapeSidebar } from "@/features/editor/components/shape-sidebar";
import { FillColorSidebar } from "@/features/editor/components/fill-color-sidebar";
import { StrokeColorSidebar } from "@/features/editor/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/features/editor/components/stroke-width-sidebar";
import { OpacitySidebar } from "@/features/editor/components/opacity-sidebar";
import { TextSidebar } from "@/features/editor/components/text-sidebar";
import { FontSidebar } from "@/features/editor/components/font-sidebar";
import { ImageSidebar } from "@/features/editor/components/image-sidebar";
import { FilterSidebar } from "@/features/editor/components/filter-sidebar";
import { DrawSidebar } from "@/features/editor/components/draw-sidebar";
import { AiSidebar } from "@/features/editor/components/ai-sidebar";
import { TemplateSidebar } from "@/features/editor/components/template-sidebar";
import { RemoveBgSidebar } from "@/features/editor/components/remove-bg-sidebar";
import { SettingsSidebar } from "@/features/editor/components/settings-sidebar";
import { EmojiSidebar } from "@/features/editor/components/emoji-sidebar";
import { IconSidebar } from "@/features/editor/components/icon-sidebar";
import { AddPageModal } from "@/features/editor/components/add-page-modal";
import { GridManager } from "@/features/editor/components/grid-manager";
import { PageDrawer } from "@/features/editor/components/page-drawer";
import { MobilePageFooter } from "@/features/editor/components/mobile-page-footer";
import { MobileZoomControl } from "@/features/editor/components/mobile-zoom-control";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

interface EditorProps {
  initialData: ResponseType["data"];
};

export const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateProject(initialData.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSave = useCallback(
    (values: { 
      json: string,
      height: number,
      width: number,
    }) => {
      mutate(values);
  }, [mutate]);

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [addPageModalOpen, setAddPageModalOpen] = useState(false);
  const [pageDrawerOpen, setPageDrawerOpen] = useState(false);
  const [manualGridView, setManualGridView] = useState(false);

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
    activeTool,
    clearSelectionCallback: onClearSelection,
    saveCallback: onSave,
  });

  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    if (tool === "draw") {
      editor?.enableDrawingMode();
    }

    if (activeTool === "draw") {
      editor?.disableDrawingMode();
    }

    if (tool === activeTool) {
      return setActiveTool("select");
    }
    
    setActiveTool(tool);
  }, [activeTool, editor]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  // Canva logic: Manual toggle OR automatic when zoomed out far
  const isGridView = manualGridView || (editor?.zoom || 1) < 0.25;

  return (
    <div className="h-full flex flex-col">
      <Navbar
        id={initialData.id}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex flex-col lg:flex-row shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {activeTool !== "select" && (
          <div 
            onClick={() => onChangeActiveTool("select")}
            className="fixed inset-0 bg-black/5 z-[30] lg:hidden transition-all duration-300 backdrop-blur-[2px]"
          />
        )}
        {!isGridView && (
            <>
                <Sidebar
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <ShapeSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <FillColorSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <StrokeColorSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <StrokeWidthSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <OpacitySidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <TextSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <FontSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <ImageSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <TemplateSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <FilterSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <AiSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <RemoveBgSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <EmojiSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <IconSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <DrawSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
                <SettingsSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
            </>
        )}
        <main className="bg-muted flex-1 overflow-hidden relative flex flex-col min-h-0 lg:pb-0">
          <div className={cn(
              "flex-1 overflow-auto bg-[#EBECF0] transition-all duration-300 relative",
              isGridView ? "opacity-0 invisible h-0" : "flex flex-col items-center"
          )} ref={containerRef}>
            <div className="flex-1 flex items-center justify-center w-full py-8 lg:py-12">
                <canvas ref={canvasRef} />
            </div>
            
            {/* Canva-style Add Page Button */}
            {!isGridView && (
                <div className="pb-24 lg:pb-8 flex items-center justify-center w-full">
                    <Button 
                        variant="outline" 
                        onClick={() => setAddPageModalOpen(true)}
                        className="h-10 px-6 border-2 border-dashed bg-white hover:bg-slate-50 transition-all rounded-lg text-slate-500 font-semibold gap-x-2 shadow-sm hover:shadow-md"
                    >
                        <Plus className="size-4" />
                        إضافة صفحة
                    </Button>
                </div>
            )}
          </div>

          {/* Desktop Toolbar */}
          {!isGridView && (
              <div className="hidden lg:block absolute top-0 left-0 right-0 z-[49]">
                <Toolbar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                    key={`${editor?.selectedObjects[0]?.type}-${editor?.selectedObjects.length}`}
                />
              </div>
          )}

          {isGridView && (
              <GridManager 
                editor={editor}
                onAddPage={() => setAddPageModalOpen(true)}
                onSelectPage={(i) => {
                    editor?.goToPage(i);
                    setManualGridView(false);
                    editor?.autoZoom();
                }}
              />
          )}

          {!isGridView && <MobileZoomControl editor={editor} />}

          {/* Footer - Only on Desktop */}
          <div className="hidden lg:block">
            <Footer 
                editor={editor} 
                onAddPage={() => setAddPageModalOpen(true)}
                isGridView={isGridView}
                toggleGridView={() => setManualGridView((prev) => !prev)}
            />  
          </div>
          
          {/* Mobile Bottom Navigation & Properties */}
          {!isGridView && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] flex flex-col pointer-events-none">
                {/* Mobile Property Toolbar - Only if selection exists */}
                {editor?.selectedObjects && editor.selectedObjects.length > 0 && (
                    <div className="pointer-events-auto bg-white/90 backdrop-blur-md border-t shadow-[0_-5px_15px_rgba(0,0,0,0.05)] w-full overflow-hidden">
                        <Toolbar
                            editor={editor}
                            activeTool={activeTool}
                            onChangeActiveTool={onChangeActiveTool}
                            key={`${editor?.selectedObjects[0]?.type}-${editor?.selectedObjects.length}-mobile`}
                        />
                    </div>
                )}
                
                {/* Main Mobile Navigation */}
                <div className="pointer-events-auto">
                    <Sidebar
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                        isGridView={isGridView}
                        toggleGridView={() => setManualGridView((prev) => !prev)}
                    />
                </div>
            </div>
          )}

          {isGridView && (
              <MobilePageFooter 
                editor={editor}
                onAddPage={() => setAddPageModalOpen(true)}
                onMore={() => setPageDrawerOpen(true)}
              />
          )}

          <AddPageModal 
            editor={editor}
            open={addPageModalOpen}
            setOpen={setAddPageModalOpen}
          />

          <PageDrawer 
            editor={editor}
            open={pageDrawerOpen}
            onOpenChange={setPageDrawerOpen}
            onAddPage={() => setAddPageModalOpen(true)}
          />
        </main>
      </div>
    </div>
  );
};
