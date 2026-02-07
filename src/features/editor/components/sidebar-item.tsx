import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full h-full lg:h-20 flex flex-col items-center justify-center gap-y-1 rounded-none border-t-4 lg:border-l-4 lg:border-t-0 border-transparent transition-all duration-200 hover:bg-gray-50 group px-2 lg:px-4",
        isActive && "bg-blue-50/50 border-t-blue-600 lg:border-l-blue-600 lg:border-t-transparent text-blue-600 hover:bg-blue-50/80"
      )}
    >
      <Icon className={cn(
        "size-5 transition-transform group-hover:scale-110",
        isActive ? "text-blue-600" : "text-gray-500"
      )} />
      <span className={cn(
        "hidden lg:block text-[10px] font-bold tracking-tight uppercase transition-colors",
        isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900"
      )}>
        {label}
      </span>
    </Button>
  );
};
