import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Editor } from "@/features/editor/types";

interface MobileZoomControlProps {
  editor: Editor | undefined;
}

export const MobileZoomControl = ({ editor }: MobileZoomControlProps) => {
  if (!editor) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 lg:hidden flex flex-col gap-y-2 bg-white rounded-2xl shadow-2xl border p-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100"
        onClick={() => editor.zoomIn()}
      >
        <ZoomIn className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100"
        onClick={() => editor.zoomOut()}
      >
        <ZoomOut className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-slate-100"
        onClick={() => editor.autoZoom()}
      >
        <Maximize2 className="size-4" />
      </Button>
    </div>
  );
};
