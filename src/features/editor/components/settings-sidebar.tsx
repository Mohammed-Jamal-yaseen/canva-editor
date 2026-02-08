import React, { useEffect, useMemo, useState } from "react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ColorPicker } from "@/features/editor/components/color-picker";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface SettingsSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

export const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(() => (workspace as any)?.fill ?? "#ffffff", [workspace]);

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, 
  [
    initialWidth,
    initialHeight,
    initialBackground
  ]);

  const changeWidth = (value: string) => setWidth(value);
  const changeHeight = (value: string) => setHeight(value);
  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  }

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <ToolSidebar
      active={activeTool === "settings"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="الإعدادات"
        description="تغيير مظهر مساحة العمل الخاصة بك"
      />
      <ScrollArea>
        <form className="space-y-4 p-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>
              الارتفاع
            </Label>
            <Input
              placeholder="الارتفاع"
              value={height}
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>
              العرض
            </Label>
            <Input
              placeholder="العرض"
              value={width}
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeWidth(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            تغيير الحجم
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            className="w-full mt-2"
            onClick={() => {
                const workspace = editor?.getWorkspace();
                if(!workspace) return;
                // Keep workspace size, just clear objects
                // Actually editor.autoZoom() might be needed?
                // Just let's check what editor.clear() does or similar.
                // Assuming we want to clear everything except workspace clip?
                // For now, let's just use deletePage which effectively clears the current page or maybe specific logic?
                // The prompt asked for "delete design".
                // I will assume deleting *all objects*.
                const canvas = editor?.canvas;
                canvas?.getObjects().forEach((obj) => {
                     if ((obj as any).name !== "clip") {
                        canvas?.remove(obj);
                     }
                });
                canvas?.renderAll();
                editor?.saveJson(); // Auto save state
            }}
          >
            مسح التصميم
          </Button>
        </form>
        <div className="p-4 border-t">
          <ColorPicker
            value={background as string}
            onChange={changeBackground}
          />
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
