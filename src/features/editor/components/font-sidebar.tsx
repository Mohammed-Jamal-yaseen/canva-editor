import { 
  ActiveTool, 
  Editor,
  fonts, 
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";

interface FontSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

export const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const value = editor?.getActiveFontFamily();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <ToolSidebar
      active={activeTool === "font"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="الخطوط"
        description="اختر الخط المناسب لتصميم نصوصك"
      />
      <ScrollArea>
        <div className="p-4 space-y-2 border-b">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="ghost"
              size="lg"
              className={cn(
                "w-full h-14 justify-start text-left rounded-xl transition-all",
                value === font ? "bg-blue-50 text-blue-600 border border-blue-200" : "hover:bg-gray-50",
              )}
              style={{
                fontFamily: font,
                fontSize: "16px",
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
