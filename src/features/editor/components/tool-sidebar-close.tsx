import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface ToolSidebarCloseProps {
  onClick: () => void;
};

export const ToolSidebarClose = ({
  onClick,
}: ToolSidebarCloseProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 left-2 lg:top-1/2 lg:-left-[1.80rem] lg:transform lg:-translate-y-1/2 h-8 w-8 lg:h-[60px] lg:w-auto flex items-center justify-center rounded-full lg:rounded-r-xl lg:px-1 lg:pl-2 border lg:border-l-0 border-y lg:border-y border-gray-200 dark:border-slate-800 bg-white dark:bg-[#18191b] group z-50 text-black dark:text-white"
    >
      <ChevronsRight className="size-4 group-hover:opacity-75 transition transform rotate-90 lg:rotate-0" />
    </button>
  );
};
