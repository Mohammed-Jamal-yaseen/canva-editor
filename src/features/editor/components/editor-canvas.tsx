
import { Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

import { Editor, ActiveTool } from "@/features/editor/types";
import { Button } from "@/shared/components/ui/button";

import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { GridManager } from "@/features/editor/components/grid-manager";
import { MobileZoomControl } from "@/features/editor/components/mobile-zoom-control";
import { MobilePageFooter } from "@/features/editor/components/mobile-page-footer";
import { Sidebar } from "@/features/editor/components/sidebar";
import { AddPageModal } from "@/features/editor/components/add-page-modal";
import { PageDrawer } from "@/features/editor/components/page-drawer";

interface EditorCanvasProps {
  editor: Editor | undefined;
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  activeTool: ActiveTool;
  isGridView: boolean;
  manualGridView: boolean;
  setManualGridView: (value: boolean | ((old: boolean) => boolean)) => void;
  addPageModalOpen: boolean;
  setAddPageModalOpen: (value: boolean) => void;
  pageDrawerOpen: boolean;
  setPageDrawerOpen: (value: boolean) => void;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const EditorCanvas = ({
  editor,
  containerRef,
  canvasRef,
  activeTool,
  isGridView,
  manualGridView,
  setManualGridView,
  addPageModalOpen,
  setAddPageModalOpen,
  pageDrawerOpen,
  setPageDrawerOpen,
  onChangeActiveTool,
}: EditorCanvasProps) => {

  return (
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
            onClose={() => {
                setManualGridView(false);
                editor?.autoZoom();
            }}
            onSelectPage={(i: number) => {
                editor?.goToPage(i);
                setManualGridView(false);
                setTimeout(() => {
                    editor?.autoZoom();
                }, 100);
            }}
          />
      )}

      {!isGridView && <MobileZoomControl editor={editor} onOpenPageDrawer={() => setPageDrawerOpen(true)} />}

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
        <div className={cn(
            "lg:hidden fixed bottom-0 left-0 right-0 z-[50] flex flex-col pointer-events-none transition-all duration-300",
            activeTool !== "select" && "translate-y-full opacity-0 invisible"
        )}>
            {/* Mobile Property Toolbar - Only if selection exists */}
            {editor?.selectedObjects && editor.selectedObjects.length > 0 && (
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-t shadow-[0_-5px_15px_rgba(0,0,0,0.05)] w-full overflow-hidden">
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

      {/* Canva-style Floating Add Button */}
      {!isGridView && (
        <button
            onClick={() => onChangeActiveTool("templates")}
            className={cn(
                "lg:hidden fixed bottom-24 left-6 size-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-xl flex items-center justify-center z-[51] active:scale-95 transition-all duration-300",
                activeTool !== "select" && "opacity-0 invisible translate-y-10"
            )}
        >
            <Plus className="size-6" />
        </button>
      )}

      {isGridView && (
          <MobilePageFooter 
            editor={editor}
            onAddPage={() => setAddPageModalOpen(true)}
            onMore={() => setPageDrawerOpen(true)}
            onClose={() => {
                setManualGridView(false);
                editor?.autoZoom();
            }}
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
  );
};
