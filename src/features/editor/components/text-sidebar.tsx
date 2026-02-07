'use client'
import { 
  ActiveTool, 
  Editor, 
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-full lg:w-[300px] h-full flex flex-col",
        activeTool === "text" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Text"
        description="Add text to your canvas"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => editor?.addText("Textbox")}
          >
            Add a textbox
          </Button>
          
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Default text styles
            </p>
            <Button
              className="w-full h-20 shadow-sm border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-y-1"
              variant="outline"
              onClick={() => editor?.addText("Heading", {
                fontSize: 80,
                fontWeight: 700,
              })}
            >
              <span className="text-2xl font-black">
                Add a heading
              </span>
            </Button>
            <Button
              className="w-full h-16 shadow-sm border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-y-1"
              variant="outline"
              onClick={() => editor?.addText("Subheading", {
                fontSize: 44,
                fontWeight: 600,
              })}
            >
              <span className="text-lg font-bold">
                Add a subheading
              </span>
            </Button>
            <Button
              className="w-full h-14 shadow-sm border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-y-1"
              variant="outline"
              onClick={() => editor?.addText("Paragraph", {
                fontSize: 32,
              })}
            >
              <span className="text-sm font-medium">
                Add a little bit of body text
              </span>
            </Button>
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
