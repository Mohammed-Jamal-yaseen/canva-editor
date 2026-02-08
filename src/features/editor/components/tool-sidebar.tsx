import { cn } from "@/shared/lib/utils";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from "@/shared/components/ui/drawer";
import { useMedia } from "react-use";

interface ToolSidebarProps {
  children: React.ReactNode;
  active: boolean;
  onClose: () => void;
  className?: string;
};

export const ToolSidebar = ({
  children,
  active,
  onClose,
  className,
}: ToolSidebarProps) => {
  const isMobile = useMedia("(max-width: 1024px)", false);

  if (isMobile) {
    return (
      <Drawer open={active} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[80%] px-0 pb-0 overflow-hidden outline-none">
          <DrawerHeader className="sr-only">
             <DrawerTitle>Tool Sidebar</DrawerTitle>
             <DrawerDescription>Tool settings and options</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <aside
      className={cn(
        "bg-white relative z-[40] w-[300px] flex flex-col transition-all duration-300 border-l",
        active ? "flex" : "hidden",
        className
      )}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
