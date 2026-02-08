import { 
  Copy, 
  Plus, 
  Trash, 
  Lock, 
  Unlock, 
  FileDown, 
  CopyPlus, 
  Settings, 
  FileText,
  X,
  Palette,
  ClipboardPaste
} from "lucide-react";
import { Editor } from "@/features/editor/types";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/shared/components/ui/drawer";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

interface PageDrawerProps {
  editor: Editor | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPage: () => void;
};

export const PageDrawer = ({ 
  editor, 
  open, 
  onOpenChange,
  onAddPage 
}: PageDrawerProps) => {
  if (!editor) return null;

  const workspace = editor.getWorkspace();
  const width = workspace?.width || 0;
  const height = workspace?.height || 0;

  const options = [
    {
      icon: Plus,
      label: "إضافة صفحة",
      onClick: () => {
        onAddPage();
        onOpenChange(false);
      }
    },
    {
      icon: Palette,
      label: "نسخ نمط الصفحة",
      onClick: () => {},
      badge: true,
    },
    {
      icon: Lock,
      label: "قفل",
      onClick: () => {},
    },
    {
        icon: FileDown,
        label: "تحميل الصفحة",
        onClick: () => editor.savePng(),
    },
    {
        icon: CopyPlus,
        label: "نسخ رابط الصفحة",
        onClick: () => {},
    },
    {
        icon: FileText,
        label: "ملاحظات",
        onClick: () => {},
    },
    {
        icon: Settings,
        label: "تغيير الحجم",
        badge: true,
        onClick: () => {},
    },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-8 max-h-[85%]">
        <DrawerHeader className="relative border-b pb-4">
          <div className="flex flex-col items-center gap-y-1">
            <DrawerTitle className="text-lg font-bold">صفحة</DrawerTitle>
            <p className="text-xs text-muted-foreground">
                تخصيص • {width} x {height} px
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full bg-slate-100 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </DrawerHeader>

        {/* Action Grid */}
        <div className="p-6 grid grid-cols-4 gap-4">
            <button 
                onClick={() => {
                   editor.onCopy();
                   onOpenChange(false);
                }}
                className="flex flex-col items-center gap-y-2 group"
            >
                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors border">
                    <Copy className="size-6 text-slate-600" />
                </div>
                <span className="text-[11px] font-bold">نسخ</span>
            </button>
            <button 
                onClick={() => {
                   editor.onPaste();
                   onOpenChange(false);
                }}
                className="flex flex-col items-center gap-y-2 group"
            >
                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors border">
                    <ClipboardPaste className="size-6 text-slate-600" />
                </div>
                <span className="text-[11px] font-bold">لصق</span>
            </button>
            <button 
                onClick={() => {
                   editor.duplicatePage();
                   onOpenChange(false);
                }}
                className="flex flex-col items-center gap-y-2 group" // Added key to trigger re-render if needed or just handled by React
            >
                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors border">
                    <CopyPlus className="size-6 text-slate-600" />
                </div>
                <span className="text-[11px] font-bold">تكرار</span>
            </button>
            <button 
                onClick={() => {
                    editor.deletePage();
                    onOpenChange(false);
                }}
                className="flex flex-col items-center gap-y-2 group"
            >
                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors border">
                    <Trash className="size-6 text-slate-600 group-hover:text-red-500" />
                </div>
                <span className="text-[11px] font-bold">حذف</span>
            </button>
        </div>

        <Separator />

        {/* Options List */}
        <div className="flex flex-col px-2 py-4 gap-y-1 overflow-auto">
            {options.map((option, i) => (
                <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start gap-x-4 h-12 font-semibold text-sm rounded-xl"
                    onClick={option.onClick}
                >
                    <option.icon className="size-5 text-slate-500" />
                    <span className="flex-1 text-right">{option.label}</span>
                    {option.badge && (
                        <div className="size-4 bg-amber-400 rounded-sm flex items-center justify-center">
                            <Plus className="size-2.5 text-white fill-white" />
                        </div>
                    )}
                </Button>
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
