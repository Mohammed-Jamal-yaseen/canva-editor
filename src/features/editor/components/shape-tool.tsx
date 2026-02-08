import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface ShapeToolProps {
  onClick: () => void;
  icon: LucideIcon | IconType;
  iconClassName?: string;
};

export const ShapeTool = ({
  onClick,
  icon: Icon,
  iconClassName
}: ShapeToolProps) => {
  return (
    <button
      onClick={onClick}
      className="aspect-square border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center bg-white dark:bg-slate-900"
    >
      <Icon className={cn("h-full w-full text-slate-700 dark:text-slate-300 transition-transform duration-300 group-hover:scale-110", iconClassName)} />
    </button>
  );
};

