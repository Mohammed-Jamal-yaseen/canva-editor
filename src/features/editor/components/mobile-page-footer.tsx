import { 
  Plus, 
  CopyPlus, 
  Trash, 
  CheckCircle2, 
  MoreHorizontal,
  Check
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Editor } from "@/features/editor/types";

interface MobilePageFooterProps {
  editor: Editor | undefined;
  onAddPage: () => void;
  onMore: () => void;
  onClose: () => void;
};

export const MobilePageFooter = ({
  editor,
  onAddPage,
  onMore,
  onClose,
}: MobilePageFooterProps) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 h-16 bg-white rounded-2xl shadow-2xl border flex items-center justify-around px-2 z-[60] lg:hidden">
      <button 
        onClick={onAddPage}
        className="flex flex-col items-center gap-y-1 group"
      >
        <Plus className="size-5 text-slate-600" />
        <span className="text-[10px] font-bold">إضافة صفحة</span>
      </button>

      <button 
        onClick={() => {
          // Duplicate current page
          const workspace = editor?.getWorkspace();
          if (workspace) {
            editor?.addPage({ 
              width: workspace.width || 800, 
              height: workspace.height || 1000 
            });
          }
        }}
        className="flex flex-col items-center gap-y-1 group"
      >
        <CopyPlus className="size-5 text-slate-600" />
        <span className="text-[10px] font-bold">تكرار</span>
      </button>

      <button 
        onClick={() => editor?.deletePage()}
        className="flex flex-col items-center gap-y-1 group"
      >
        <Trash className="size-5 text-slate-600" />
        <span className="text-[10px] font-bold">حذف</span>
      </button>

      <button className="flex flex-col items-center gap-y-1 group">
        <CheckCircle2 className="size-5 text-slate-600" />
        <span className="text-[10px] font-bold">تحديد</span>
      </button>

      <button 
        onClick={onMore}
        className="flex flex-col items-center gap-y-1 group"
      >
        <MoreHorizontal className="size-5 text-slate-600" />
        <span className="text-[10px] font-bold">المزيد</span>
      </button>

      <div className="h-8 w-[1px] bg-slate-100 mx-1" />

      <Button onClick={onClose} size="icon" variant="outline" className="rounded-full h-10 w-10 border-2">
        <Check className="size-5" />
      </Button>
    </div>
  );
};
