import { 
  ActiveTool, 
  Editor, 
  STROKE_COLOR, 
  STROKE_WIDTH
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ColorPicker } from "@/features/editor/components/color-picker";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

import { useMedia } from "react-use";
import { colors } from "@/features/editor/types";

interface DrawSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const DrawSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: DrawSidebarProps) => {
  const isMobile = useMedia("(max-width: 1024px)", false);

  const colorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onColorChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  const onWidthChange = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  // Mobile Drawing Controls - Non-modal
  if (isMobile) {
      if (activeTool !== "draw") return null;

      return (
        <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t p-4 z-[50] shadow-xl space-y-4">
             <div className="flex items-center justify-between mb-2">
                 <Label className="text-sm font-bold">إعدادات الفرشاة</Label>
                 <button 
                    onClick={onClose}
                    className="text-xs bg-slate-100 px-3 py-1.5 rounded-full font-bold text-slate-700"
                 >
                    تم
                 </button>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs">سُمك الخط</Label>
                    <Slider
                        value={[widthValue]}
                        onValueChange={(values) => onWidthChange(values[0])}
                        className="cursor-pointer"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">اللون</Label>
                    <div className="w-full overflow-x-auto no-scrollbar pb-2">
                        <div className="flex flex-row space-x-3 px-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => onColorChange(color)}
                                    className={cn(
                                        "h-10 w-10 rounded-full border border-slate-200 shadow-sm transition-all shrink-0",
                                        colorValue === color && "ring-2 ring-blue-500 ring-offset-2 scale-110"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </div>
      );
  }

  return (
    <ToolSidebar
      active={activeTool === "draw"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="وضع الرسم"
        description="تعديل إعدادات الفرشاة"
      />
      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <Label className="text-sm font-bold">
            سُمك الفرشاة
          </Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onWidthChange(values[0])}
            className="cursor-pointer"
          />
        </div>
        <div className="p-4 space-y-6">
          <Label className="text-sm font-bold">
            اللون
          </Label>
          <ColorPicker
            value={colorValue}
            onChange={onColorChange}
          />
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
