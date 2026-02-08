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

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <ToolSidebar
      active={activeTool === "text"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="النصوص"
        description="أضف نصوصاً بتنسيقات مختلفة لتصميمك"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
            onClick={() => editor?.addText("نص جديد")}
          >
            إضافة مربع نص
          </Button>
          
          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                أنماط النصوص الافتراضية
            </p>
            <Button
              className="w-full h-20 shadow-sm border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-y-1 rounded-xl"
              variant="outline"
              onClick={() => editor?.addText("عنوان رئيسي", {
                fontSize: 80,
                fontWeight: 700,
              })}
            >
              <span className="text-2xl font-black">
                إضافة عنوان
              </span>
            </Button>
            <Button
              className="w-full h-16 shadow-sm border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-y-1 rounded-xl"
              variant="outline"
              onClick={() => editor?.addText("عنوان فرعي", {
                fontSize: 44,
                fontWeight: 600,
              })}
            >
              <span className="text-lg font-bold">
                إضافة عنوان فرعي
              </span>
            </Button>
            <Button
              className="w-full h-14 shadow-sm border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-y-1 rounded-xl"
              variant="outline"
              onClick={() => editor?.addText("نص فقرة", {
                fontSize: 32,
              })}
            >
              <span className="text-xs font-medium">
                إضافة نص بسيط للفقرات
              </span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
