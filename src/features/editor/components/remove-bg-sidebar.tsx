"use client";

import Image from "next/image";
import { AlertTriangle, Loader2, Sparkles, ShieldCheck } from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useUploadThing } from "@/shared/lib/uploadthing";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { toast } from "sonner";
import { useBgRemoval } from "@/features/ai/hooks/use-background-removal";

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();
  const { 
    removeBg, 
    loading,
    error: removalError
  } = useBgRemoval();
  
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  // Get selected image source safely
  const selectedObject = editor?.selectedObjects[0];
  // @ts-ignore - Accessing underlying fabric/canvas element
  const imageSrc = selectedObject?._originalElement?.currentSrc as string | undefined;

  const onClose = () => onChangeActiveTool("select");

  const handleRemoveBackground = async () => {
    if (shouldBlock) return triggerPaywall();
    if (!imageSrc) return;

    try {
      // 1. Local AI Inference
      const localUrl = await removeBg(imageSrc);
      
      if (localUrl) {
        // 2. Instant UI Update
        editor?.addImage(localUrl);
        toast.success("Background removed successfully");
        
        // 3. Persistent Storage (Upload in background)
        const response = await fetch(localUrl);
        const blob = await response.blob();
        const file = new File([blob], "removed-bg.png", { type: "image/png" });
        
        await startUpload([file]);
      }
    } catch (err: any) {
      console.error("BG_FLOW_FAILURE:", err);
      toast.error(err?.message || "Failed to process image. Check browser compatibility.");
    }
  };

  const isBusy = loading || isUploading;

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-full lg:w-[300px] h-full flex flex-col",
        activeTool === "remove-bg" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="AI Background Remover"
        description="Professional local isolation engine"
      />

      {!imageSrc ? (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1 p-8 text-center">
          <div className="p-4 bg-muted rounded-full">
             <AlertTriangle className="size-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs font-medium">
            Please select an image on the canvas to use this tool.
          </p>
        </div>
      ) : (
        <ScrollArea>
          <div className="p-4 space-y-4">
            {/* Preview Card */}
            <div className={cn(
              "relative aspect-square rounded-xl overflow-hidden border bg-slate-50 transition-all",
              isBusy && "ring-2 ring-primary ring-offset-2"
            )}>
              <Image
                src={imageSrc}
                fill
                alt="Original"
                className={cn("object-contain p-2", isBusy && "blur-[2px] opacity-50")}
              />
              
              {isBusy && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                  <Loader2 className="size-8 animate-spin text-primary mb-3" />
                  <div className="text-center px-4">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest">
                      {loading ? `Analyzing...` : "Syncing..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Error Feedback */}
            {removalError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-x-3 items-start animate-in fade-in zoom-in-95">
                 <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-red-600 font-medium leading-tight">{removalError}</p>
              </div>
            )}

            {/* Action Button */}
            <Button
              disabled={isBusy}
              onClick={handleRemoveBackground}
              className="w-full h-11 shadow-sm"
              size="lg"
            >
              {isBusy ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="size-4 mr-2" />
              )}
              Remove Background
            </Button>

            <hr className="border-border/50" />

            {/* Privacy Badge */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex gap-x-3">
               <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
               <div>
                  <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-tight">Privacy Protected</p>
                  <p className="text-[10px] text-emerald-700/80 leading-snug">
                    Processing happens on your device. Images are never sent to external AI servers.
                  </p>
               </div>
            </div>
          </div>
        </ScrollArea>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};