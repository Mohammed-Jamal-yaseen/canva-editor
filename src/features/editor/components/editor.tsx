
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
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Sidebar } from "@/features/editor/components/sidebar";
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
import { PropertiesSidebar } from "@/features/editor/components/properties-sidebar";
import { EditorCanvas } from "@/features/editor/components/editor-canvas";
import { Button } from "@/shared/components/ui/button";
import { Settings2 } from "lucide-react";

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
  const [propertiesOpen, setPropertiesOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setPropertiesOpen(false);
    }
  }, []);

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

  const isGridView = manualGridView;

  return (
    <div className="h-full flex flex-col">
      <Navbar
        id={initialData.id}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex flex-col lg:flex-row shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {activeTool !== "select" && activeTool !== "draw" && (
          <div 
            onClick={() => onChangeActiveTool("select")}
            className="fixed inset-0 bg-black/60 z-[30] lg:hidden transition-all duration-300 backdrop-blur-md"
          />
        )}
        {!isGridView && (
            <>
                <div className="hidden lg:block h-full">
                    <Sidebar
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />
                </div>
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
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
             {/* Toggle Properties Button - Desktop Only */}
             {!isGridView && !propertiesOpen && (
                 <div className="absolute top-4 left-4 z-[50]">
                     <Button 
                         variant="secondary" 
                         size="icon" 
                         className="size-10 rounded-full shadow-lg bg-white dark:bg-slate-900 border dark:border-slate-800"
                         onClick={() => setPropertiesOpen(true)}
                     >
                         <Settings2 className="size-5 text-slate-600 dark:text-slate-300" />
                     </Button>
                 </div>
             )}

             <EditorCanvas
                editor={editor}
                containerRef={containerRef as React.RefObject<HTMLDivElement>}
                canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                activeTool={activeTool}
                isGridView={isGridView}
                manualGridView={manualGridView}
                setManualGridView={setManualGridView}
                addPageModalOpen={addPageModalOpen}
                setAddPageModalOpen={setAddPageModalOpen}
                pageDrawerOpen={pageDrawerOpen}
                setPageDrawerOpen={setPageDrawerOpen}
                onChangeActiveTool={onChangeActiveTool}
             />
        </div>

        {/* Properties Sidebar (Optional Right Panel) */}
        {!isGridView && (
            <PropertiesSidebar 
                editor={editor} 
                open={propertiesOpen}
                onOpenChange={setPropertiesOpen}
            /> 
        )}
      </div>
    </div>
  );
};
