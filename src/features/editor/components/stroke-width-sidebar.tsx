import { 
  ActiveTool, 
  Editor, 
  STROKE_DASH_ARRAY, 
  STROKE_WIDTH
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

export const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  }

  return (
    <ToolSidebar
      active={activeTool === "stroke-width"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="إعدادات الإطار"
        description="تعديل سُمك ونمط إطار العنصر"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm font-bold">
            سُمك الإطار
          </Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
            className="cursor-pointer"
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm font-bold">
            نمط الإطار
          </Label>
          <Button
            onClick={() => onChangeStrokeType([])}
            variant="ghost"
            size="lg"
            className={cn(
              "w-full h-14 justify-start text-left rounded-xl border-2 transition-all",
              JSON.stringify(typeValue) === `[]` ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:bg-gray-50"
            )}
          >
            <div className="w-full border-black rounded-full border-2" />
          </Button>
          <Button
            onClick={() => onChangeStrokeType([5, 5])}
            variant="ghost"
            size="lg"
            className={cn(
              "w-full h-14 justify-start text-left rounded-xl border-2 transition-all",
              JSON.stringify(typeValue) === `[5,5]` ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:bg-gray-50"
            )}
          >
            <div className="w-full border-black rounded-full border-2 border-dashed" />
          </Button>
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
