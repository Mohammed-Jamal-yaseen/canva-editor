import { 
  Check,
  ChevronLeft, 
  ChevronRight, 
  Fullscreen,
  LayoutGrid, 
  Maximize2, 
  MessageSquare,
  Minus,
  Minimize, 
  Plus, 
  Trash, 
  ZoomIn, 
  ZoomOut 
} from "lucide-react";
import { useState, useEffect } from "react";

import { Editor } from "@/features/editor/types";

import { Button } from "@/shared/components/ui/button";
import { Hint } from "@/shared/components/hint";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import { Slider } from "@/shared/components/ui/slider";

interface FooterProps {
  editor: Editor | undefined;
  onAddPage: () => void;
  isGridView: boolean;
  toggleGridView: () => void;
};

export const Footer = ({ 
    editor, 
    onAddPage,
    isGridView,
    toggleGridView
}: FooterProps) => {
  const [zoomPercent, setZoomPercent] = useState(10);
  
  useEffect(() => {
    if (!editor) return;
    setZoomPercent(Math.round(editor.zoom * 100));
  }, [editor?.zoom]);

  const handleZoomChange = (values: number[]) => {
    const value = values[0];
    setZoomPercent(value);
    editor?.setZoom(value / 100);
  };

  const handleZoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/%/g, ""), 10);
    if (!isNaN(value)) {
        setZoomPercent(value);
    }
  };

  const handleZoomBlur = () => {
    editor?.setZoom(zoomPercent / 100);
  };

  const handleZoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editor?.setZoom(zoomPercent / 100);
  };

  return (
    <footer className="h-[40px] border-t bg-white w-full flex items-center justify-between z-[35] px-4 shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] select-none">
      {/* Left: Notes & Feed */}
      <div className="flex items-center gap-x-1">
        <Button variant="ghost" size="sm" className="h-8 gap-x-2 text-[11px] font-bold px-3 hover:bg-slate-100 rounded-lg text-slate-600">
            <MessageSquare className="size-4" />
            <span>ملاحظات</span>
        </Button>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-x-3 h-full">
        {/* Page Navigation */}
        <div className="flex items-center gap-x-1">
            <Hint label="الصفحة السابقة" side="top">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:bg-slate-100" 
                    disabled={editor?.currentPage === 0}
                    onClick={() => editor?.prevPage()}
                >
                    <ChevronRight className="size-4" />
                </Button>
            </Hint>
            
            <div className="px-2 min-w-[60px] text-center">
                <span className="text-[11px] font-black text-slate-700 tabular-nums">
                    {(editor?.currentPage || 0) + 1} / {editor?.totalPages || 1}
                </span>
            </div>

            <Hint label="الصفحة التالية" side="top">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:bg-slate-100" 
                    disabled={(editor?.currentPage || 0) >= (editor?.totalPages || 1) - 1}
                    onClick={() => editor?.nextPage()}
                >
                    <ChevronLeft className="size-4" />
                </Button>
            </Hint>
        </div>

        <Separator orientation="vertical" className="h-4 mx-1" />

        {/* Grid View Toggle */}
        <Hint label="عرض الشبكة" side="top">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleGridView}
                className={cn(
                    "h-8 w-8 transition-all rounded-lg",
                    isGridView ? "text-purple-600 bg-purple-50 shadow-inner" : "text-slate-500 hover:bg-slate-100"
                )}
            >
                <LayoutGrid className="size-4" />
            </Button>
        </Hint>

        <Separator orientation="vertical" className="h-4 mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-x-2">
            <Hint label="تصغير" side="top">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                    onClick={() => editor?.zoomOut()}
                >
                    <Minus className="size-3" />
                </Button>
            </Hint>
            
            <div className="flex items-center gap-x-2 min-w-[120px]">
                <Slider 
                    value={[zoomPercent]}
                    min={20}
                    max={500}
                    step={1}
                    onValueChange={handleZoomChange}
                    className="cursor-pointer"
                />
            </div>

            <Hint label="تكبير" side="top">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                    onClick={() => editor?.zoomIn()}
                >
                    <Plus className="size-3" />
                </Button>
            </Hint>

            <form onSubmit={handleZoomSubmit} className="ml-1">
                <input
                    type="text"
                    value={`${zoomPercent}%`}
                    onChange={handleZoomInput}
                    onBlur={handleZoomBlur}
                    className="w-[45px] h-7 text-[11px] font-bold text-center bg-slate-50 border-none outline-none hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-purple-200 rounded-md transition-all cursor-pointer"
                />
            </form>
        </div>

        <Separator orientation="vertical" className="h-4 mx-1" />

        {/* Full Screen */}
        <Hint label="ملء الشاشة" side="top">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        document.documentElement.requestFullscreen();
                    }
                }}
                className="h-8 w-8 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
                <Maximize2 className="size-4" />
            </Button>
        </Hint>
      </div>
    </footer>
  );
};
