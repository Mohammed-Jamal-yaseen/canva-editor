import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { 
  Star, 
  ArrowUp,
  Hexagon,
  Square
} from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ShapeTool } from "@/features/editor/components/shape-tool";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <ToolSidebar
      active={activeTool === "shapes"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="الأشكال"
        description="أضف أشكالاً متنوعة للتصميم"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-2 p-4">
          <ShapeTool
            onClick={() => editor?.addCircle()}
            icon={FaCircle}
          />
          <ShapeTool
            onClick={() => editor?.addSoftRectangle()}
            icon={FaSquare}
          />
          <ShapeTool
            onClick={() => editor?.addRectangle()}
            icon={FaSquareFull}
          />
          <ShapeTool
            onClick={() => editor?.addTriangle()}
            icon={IoTriangle}
          />
          <ShapeTool
            onClick={() => editor?.addInverseTriangle()}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool
            onClick={() => editor?.addDiamond()}
            icon={FaDiamond}
          />
          <ShapeTool
            onClick={() => editor?.addPentagon()}
            icon={Hexagon}
            iconClassName="rotate-[18deg]"
          />
          <ShapeTool
            onClick={() => editor?.addHexagon()}
            icon={Hexagon}
          />
          <ShapeTool
            onClick={() => editor?.addOctagon()}
            icon={Hexagon}
            iconClassName="rotate-[22.5deg]"
          />
          <ShapeTool
            onClick={() => editor?.addStar()}
            icon={Star}
          />
          <ShapeTool
            onClick={() => editor?.addArrow()}
            icon={ArrowUp}
            iconClassName="rotate-90"
          />
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
