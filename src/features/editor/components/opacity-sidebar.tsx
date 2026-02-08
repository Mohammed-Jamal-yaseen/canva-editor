import { useEffect, useMemo, useState } from "react";

import { 
  ActiveTool, 
  Editor, 
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/shared/lib/utils";
import { Slider } from "@/shared/components/ui/slider";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface OpacitySidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: OpacitySidebarProps) => {
  const initialValue = editor?.getActiveOpacity() || 1;
  const selectedObject = useMemo(() => editor?.selectedObjects[0], [editor?.selectedObjects]);

  const [opacity, setOpacity] = useState(initialValue);

  useEffect(() => {
    if (selectedObject) {
      setOpacity(selectedObject.get("opacity") || 1);
    }
  }, [selectedObject]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value);
  };

  return (
    <ToolSidebar
      active={activeTool === "opacity"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="الشفافية"
        description="تغيير درجة شفافية العنصر المختار"
      />
      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <Slider
            value={[opacity]}
            onValueChange={(values) => onChange(values[0])}
            max={1}
            min={0}
            step={0.01}
            className="cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>0%</span>
            <span>{Math.round(opacity * 100)}%</span>
            <span>100%</span>
          </div>
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
