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
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { toast } from "sonner";
import { useBgRemoval } from "@/features/ai/hooks/use-background-removal";

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

import { ToolSidebar } from "@/features/editor/components/tool-sidebar";

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
        toast.success("تم مسح الخلفية بنجاح");
        
        // 3. Persistent Storage (Upload in background)
        const response = await fetch(localUrl);
        const blob = await response.blob();
        const file = new File([blob], "removed-bg.png", { type: "image/png" });
        
        await startUpload([file]);
      }
    } catch (err: any) {
      console.error("BG_FLOW_FAILURE:", err);
      toast.error(err?.message || "فشل معالجة الصورة. تأكد من متصفحك.");
    }
  };

  const isBusy = loading || isUploading;

  return (
    <ToolSidebar
      active={activeTool === "remove-bg"}
      onClose={onClose}
    >
      <ToolSidebarHeader
        title="حذف الخلفية"
        description="استخدم الذكاء الاصطناعي لفصل العناصر عن خلفيتها بدقة"
      />

      {!imageSrc ? (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1 p-8 text-center">
          <div className="p-4 bg-muted rounded-full">
             <AlertTriangle className="size-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs font-bold leading-relaxed">
            يرجى اختيار صورة من مساحة العمل أولاً لاستخدام هذه الأداة
          </p>
        </div>
      ) : (
        <ScrollArea>
          <div className="p-4 space-y-6">
            {/* Preview Card */}
            <div className={cn(
              "relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed bg-slate-50 transition-all shadow-inner",
              isBusy && "ring-4 ring-blue-100 border-blue-500"
            )}>
              <Image
                src={imageSrc}
                fill
                alt="Original"
                className={cn("object-contain p-4 transition-all duration-500", isBusy && "scale-90 blur-sm opacity-50")}
              />
              
              {isBusy && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
                   <div className="relative">
                      <Loader2 className="size-10 animate-spin text-blue-600" />
                      <Sparkles className="size-4 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
                   </div>
                  <div className="mt-4 text-center px-4">
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] animate-pulse">
                      {loading ? `جاري التحليل...` : "جاري المزامنة..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Error Feedback */}
            {removalError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-x-3 items-start animate-in fade-in slide-in-from-top-2">
                 <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-red-700 font-bold leading-tight">{removalError}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="space-y-3">
                <Button
                disabled={isBusy}
                onClick={handleRemoveBackground}
                className="w-full h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-95 transition-all"
                size="lg"
                >
                {isBusy ? (
                    <Loader2 className="size-5 animate-spin ml-3" />
                ) : (
                    <Sparkles className="size-5 ml-3" />
                )}
                حذف الخلفية الآن
                </Button>
                <p className="text-[10px] text-center text-muted-foreground font-medium">
                    يتم مراجعة الصورة ومعالجتها على جهازك مباشرة
                </p>
            </div>

            <Separator className="bg-slate-100" />

            {/* Privacy Badge */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex gap-x-4 items-center">
               <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-6 text-emerald-600" />
               </div>
               <div>
                  <p className="text-[11px] text-emerald-800 font-black uppercase tracking-tight">خصوصيتك محمية</p>
                  <p className="text-[10px] text-emerald-700/80 leading-snug font-medium">
                    تتم المعالجة محلياً في المتصفح. لا يتم إرسال صورك إلى خوادم خارجية.
                  </p>
               </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </ToolSidebar>
  );
};