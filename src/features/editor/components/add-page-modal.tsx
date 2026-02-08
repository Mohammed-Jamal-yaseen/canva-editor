import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { 
  FileSpreadsheet, 
  FileText, 
  Presentation as PresentationIcon, 
  Monitor, 
  Share2, 
  Video, 
  Globe, 
  MoreHorizontal,
  X
} from "lucide-react";
import { PAGE_TYPES, Editor } from "@/features/editor/types";
import { Button } from "@/shared/components/ui/button";
import { useMedia } from "react-use";

interface AddPageModalProps {
  editor: Editor | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const AddPageModal = ({
  editor,
  open,
  setOpen,
}: AddPageModalProps) => {
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onSelect = (width: number, height: number) => {
    editor?.addPage({ width, height });
    setOpen(false);
  };

  const onDefault = () => {
    editor?.addPage();
    setOpen(false);
  };

  const iconMap: Record<string, any> = {
    Sheet: FileSpreadsheet,
    Doc: FileText,
    Presentation: PresentationIcon,
    Whiteboard: Monitor,
    SocialMedia: Share2,
    Video: Video,
    Websites: Globe,
  };

  const content = (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {PAGE_TYPES.map((type) => {
        const Icon = iconMap[type.icon] || MoreHorizontal;
        return (
          <button
            key={type.label}
            onClick={() => onSelect(type.width, type.height)}
            className="flex flex-col items-center gap-y-3 p-4 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Icon className="size-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight">
              {type.label}
            </span>
          </button>
        );
      })}
      <button
        onClick={() => onDefault()}
        className="flex flex-col items-center gap-y-3 p-4 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
      >
        <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          <MoreHorizontal className="size-6 text-slate-600" />
        </div>
        <span className="text-xs font-semibold text-center leading-tight">
          تلقائي
        </span>
      </button>
    </div>
  );

  if (isMobile) {
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="pb-8 overflow-hidden">
                <DrawerHeader className="px-6 flex flex-row items-center justify-between border-b">
                    <DrawerTitle className="text-xl font-bold">اختيار نوع الصفحة</DrawerTitle>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between border-b">
          <DialogTitle className="text-xl font-bold">اختيار نوع الصفحة</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
            <X className="size-5" />
          </Button>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
