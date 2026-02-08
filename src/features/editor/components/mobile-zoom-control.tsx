import { ZoomIn, ZoomOut, Maximize2, Layers } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Editor } from "@/features/editor/types";

interface MobileZoomControlProps {
  editor: Editor | undefined;
  onOpenPageDrawer: () => void;
}

export const MobileZoomControl = ({ editor, onOpenPageDrawer }: MobileZoomControlProps) => {
  if (!editor) return null;

  return (
    <div className="fixed bottom-32 right-4 z-50 lg:hidden flex flex-col gap-y-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 p-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={onOpenPageDrawer}
      >
        <Layers className="size-5 text-slate-600 dark:text-slate-300" />
      </Button>
      <div className="h-[1px] bg-slate-100 dark:bg-slate-700 w-full" />
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={() => editor.zoomIn()}
      >
        <ZoomIn className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={() => editor.zoomOut()}
      >
        <ZoomOut className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={() => editor.autoZoom()}
      >
        <Maximize2 className="size-4" />
      </Button>
    </div>
  );
};
