import React, { useEffect, useState } from 'react';
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const EmojiSidebar = ({ editor, activeTool, onChangeActiveTool }: EmojiSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    editor?.addText(emojiData.emoji);
    onClose();
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-full lg:w-[300px] h-full flex flex-col",
        activeTool === "emoji" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Emojis" description="Add emojis to your canvas" />
      <ScrollArea>
        <div className="p-4">
            {isMounted && (
              <EmojiPicker 
                  onEmojiClick={onEmojiClick}
                  width="100%"
                  searchDisabled={false}
              />
            )}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
