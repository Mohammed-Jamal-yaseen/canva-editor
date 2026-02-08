import { Plus } from "lucide-react";
import { Editor } from "@/features/editor/types";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface GridManagerProps {
  editor: Editor | undefined;
  onAddPage: () => void;
  onSelectPage: (index: number) => void;
  onClose: () => void;
};

export const GridManager = ({
  editor,
  onAddPage,
  onSelectPage,
  onClose,
}: GridManagerProps) => {
  if (!editor) return null;

  return (
    <div className="w-full bg-white dark:bg-[#18191b] h-full flex flex-col overflow-hidden pb-20 lg:pb-0 z-[100] fixed inset-0">
      {/* Top Bar with Page Thumbnails - Canva Style */}
      <div className="border-b dark:border-slate-800 bg-white dark:bg-[#18191b] sticky top-0 z-10 shadow-sm shrink-0">
        <div className="px-4 py-3 flex items-center justify-between border-b dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">عرض الشبكة</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full font-bold text-purple-600 hover:bg-purple-50">
                إغلاق
            </Button>
        </div>
        <div className="px-4 py-3 flex items-center gap-x-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">الصفحات:</span>
          
          <div className="flex items-center gap-x-2">
            {Array.from({ length: editor.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectPage(i)}
                className={cn(
                  "relative flex-shrink-0 w-16 h-20 rounded-lg border-2 transition-all overflow-hidden group",
                  editor.currentPage === i 
                    ? "border-purple-600 ring-2 ring-purple-100 dark:ring-purple-900/50 shadow-md" 
                    : "border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-sm"
                )}
              >
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">صفحة</span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{i + 1}</span>
                </div>
                {editor.currentPage === i && (
                  <div className="absolute inset-0 bg-purple-600/5 pointer-events-none" />
                )}
              </button>
            ))}
            
            <button
              onClick={() => {
                editor.addPage();
                onSelectPage(editor.totalPages);
              }}
              className="flex-shrink-0 w-16 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-y-1 text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Plus className="size-5" />
              <span className="text-[9px] font-bold">جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="p-4 lg:p-8 bg-slate-50 dark:bg-[#0f0f10] h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">اختر صفحة للتحرير</h2>
            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">انقر على أي صفحة للبدء في التحرير</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {Array.from({ length: editor.totalPages }).map((_, i) => (
              <div key={i} className="flex flex-col gap-y-2">
                <button
                  onClick={() => onSelectPage(i)}
                  className={cn(
                    "aspect-[3/4] bg-white rounded-xl shadow-sm border-2 transition-all overflow-hidden flex items-center justify-center relative group hover:shadow-lg",
                    editor.currentPage === i 
                      ? "border-purple-600 ring-4 ring-purple-100 shadow-lg" 
                      : "border-slate-200 hover:border-purple-300"
                  )}
                >
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-300 dark:text-slate-700">{i + 1}</span>
                  </div>
                  
                  {editor.currentPage === i && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      الحالي
                    </div>
                  )}
                </button>
                <span className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">صفحة {i + 1}</span>
              </div>
            ))}
            
            <div className="flex flex-col gap-y-2">
              <button
                onClick={() => {
                   editor.addPage();
                   onSelectPage(editor.totalPages);
                }}
                className="aspect-[3/4] bg-slate-100/50 dark:bg-slate-900/40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-800 transition-all group"
              >
                <div className="flex flex-col items-center gap-y-2">
                  <Plus className="size-10 text-slate-400 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400">إضافة صفحة</span>
                </div>
              </button>
              <span className="text-center text-xs font-semibold text-slate-400 dark:text-slate-600">جديد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
