import { ChevronsLeft } from "lucide-react";

interface ToolSidebarCloseProps {
  onClick: () => void;
};

export const ToolSidebarClose = ({
  onClick,
}: ToolSidebarCloseProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 lg:top-1/2 lg:-right-[1.80rem] lg:transform lg:-translate-y-1/2 h-8 w-8 lg:h-[70px] lg:w-auto flex items-center justify-center rounded-full lg:rounded-r-xl lg:px-1 lg:pr-2 border lg:border-l-0 border-y lg:border-y border-gray-200 bg-white group z-50"
    >
      <ChevronsLeft className="size-4 text-black group-hover:opacity-75 transition transform rotate-90 lg:rotate-0" />
    </button>
  );
};
