import React, { useState } from "react";
import Image from "next/image";
import { Download, Trash2, Plus, Loader2 } from "lucide-react";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { downloadFile } from "@/features/editor/utils";
import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

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
        setGeneratedImage(data[0]);
        setValue(""); // Clear the textarea
      }
    });
  };

  const handleAddImage = () => {
    if (generatedImage && editor) {
      editor.addImage(generatedImage);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadFile(generatedImage, "jpg");
    }
  };

  const handleRemove = () => {
    setGeneratedImage(null);
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <ToolSidebar
      active={activeTool === "ai"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="الذكاء الاصطناعي"
        description="حول أفكارك إلى صور احترافية باستخدام الذكاء الاصطناعي"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          {generatedImage && (
            <div className="space-y-4">
               <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group border shadow-inner">
                  <Image 
                    src={generatedImage}
                    alt="Generated image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleAddImage}
                      title="Add to canvas"
                    >
                      <Plus className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleDownload}
                      title="Download"
                    >
                      <Download className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={handleRemove}
                      title="Clear"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAddImage}
                    variant="outline"
                    className="w-full rounded-lg font-bold"
                  >
                    إضافة إلى التصميم
                  </Button>
               </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              disabled={mutation.isPending}
              placeholder="مثال: رائد فضاء يركب خيلاً في المريخ، إضاءة درامية، تفاصيل عالية"
              cols={30}
              rows={10}
              required
              minLength={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="resize-none rounded-xl focus-visible:ring-blue-500 border-gray-200"
            />
            <Button
              disabled={mutation.isPending}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                "توليد الصورة"
              )}
            </Button>
          </form>
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};
