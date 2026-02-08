import { useState } from "react";
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
import { DrawSidebarMobile } from "@/features/editor/components/draw-sidebar-mobile";

import { useMedia } from "react-use";
import { colors } from "@/features/editor/types";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mobile Drawing Controls - Non-modal
  if (isMobile) {
      if (activeTool !== "draw") return null;

      return (
        <DrawSidebarMobile
          editor={editor}
          activeTool={activeTool}
          onClose={onClose}
        />
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
