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
      className="aspect-square border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition-all duration-300 group shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center bg-white"
    >
      <Icon className={cn("h-full w-full text-slate-700 transition-transform duration-300 group-hover:scale-110", iconClassName)} />
    </button>
  );
};

