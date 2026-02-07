import React, { useState } from "react";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";


import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface AiSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();
  const mutation = useGenerateImage();

  const [value, setValue] = useState("");

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (shouldBlock) {
      triggerPaywall();
      return;
    }

    mutation.mutate({ prompt: value }, {
      onSuccess: ({ data }) => {
        editor?.addImage(data[0]);
      }
    });
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-full lg:w-[300px] h-full flex flex-col",
        activeTool === "ai" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="AI"
        description="Generate an image using AI"
      />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-6">
          <Textarea
            disabled={mutation.isPending}
            placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
          >
            Generate
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
