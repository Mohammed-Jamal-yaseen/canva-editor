"use client";

import { 
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
  LayoutGrid,
  Smile,
  Sticker
} from "lucide-react";

import { ActiveTool } from "@/features/editor/types";
import { SidebarItem } from "@/features/editor/components/sidebar-item";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const Sidebar = ({
  activeTool,
  onChangeActiveTool,
}: SidebarProps) => {
  return (
    <aside className="bg-white flex flex-row w-full h-[50px] lg:flex-col lg:w-[84px] lg:h-full border-r overflow-auto lg:overflow-y-auto shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-40">
      <ul className="flex flex-row lg:flex-col flex-1 divide-x lg:divide-x-0 lg:divide-y divide-gray-50 overflow-x-auto lg:overflow-visible scrollbar-hide">
        <SidebarItem
          icon={LayoutGrid}
          label="Design"
          isActive={activeTool === "templates"}
          onClick={() => onChangeActiveTool("templates")}
        />
        <SidebarItem
          icon={ImageIcon}
          label="Gallery"
          isActive={activeTool === "images"}
          onClick={() => onChangeActiveTool("images")}
        />
        <SidebarItem
          icon={Type}
          label="Type"
          isActive={activeTool === "text"}
          onClick={() => onChangeActiveTool("text")}
        />
        <SidebarItem
          icon={Shapes}
          label="Build"
          isActive={activeTool === "shapes"}
          onClick={() => onChangeActiveTool("shapes")}
        />
        <SidebarItem
          icon={Pencil}
          label="Draw"
          isActive={activeTool === "draw"}
          onClick={() => onChangeActiveTool("draw")}
        />
        <SidebarItem
          icon={Sparkles}
          label="Magic"
          isActive={activeTool === "ai"}
          onClick={() => onChangeActiveTool("ai")}
        />
        <SidebarItem
          icon={Smile}
          label="Emoji"
          isActive={activeTool === "emoji"}
          onClick={() => onChangeActiveTool("emoji")}
        />
        <SidebarItem
          icon={Sticker}
          label="Icons"
          isActive={activeTool === "icon"}
          onClick={() => onChangeActiveTool("icon")}
        />
      </ul>
      <div className="flex flex-col lg:block ml-auto lg:ml-0 lg:mt-auto border-l lg:border-l-0 lg:border-t border-gray-100 px-2 lg:px-0 bg-white">
        <SidebarItem
          icon={Settings}
          label="Config"
          isActive={activeTool === "settings"}
          onClick={() => onChangeActiveTool("settings")}
        />
      </div>
    </aside>
  );
};
