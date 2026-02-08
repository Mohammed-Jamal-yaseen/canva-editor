"use client";

import { 
  LayoutGrid,
  Shapes,
  Type,
  CloudUpload,
  Crown,
  Wand2,
  Settings,
  Pencil,
  Smile,
  Sticker,
  Grab,
  LayoutTemplate,
  ImageIcon,
  Sparkles,
  Plus,
  SettingsIcon
} from "lucide-react";

import { ActiveTool } from "@/features/editor/types";
import { SidebarItem } from "@/features/editor/components/sidebar-item";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  isGridView?: boolean;
  toggleGridView?: () => void;
};

export const Sidebar = ({
  activeTool,
  onChangeActiveTool,
  isGridView,
  toggleGridView,
}: SidebarProps) => {
  return (
    <aside className="bg-white/95 backdrop-blur-md flex flex-row w-full h-[72px] lg:flex-col lg:w-[84px] lg:h-full border-r lg:border-t-0 border-t border-gray-100 z-40 lg:shadow-sm shadow-[0_-5px_20px_rgba(0,0,0,0.05)] overflow-hidden lg:relative">
      {/* Mobile Navigation */}
      <div className="flex-1 w-full h-full lg:hidden overflow-x-auto scrollbar-hide no-scrollbar snap-x snap-mandatory">
        <ul className="flex flex-row h-full items-center justify-around px-2 min-w-max md:min-w-full">
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={LayoutTemplate}
              label="الصفحات"
              isActive={isGridView}
              onClick={toggleGridView || (() => {})}
            />
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={LayoutGrid}
              label="التصميم"
              isActive={activeTool === "templates"}
              onClick={() => onChangeActiveTool("templates")}
            />
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={Shapes}
              label="العناصر"
              isActive={activeTool === "shapes" || activeTool === "icon" || activeTool === "emoji"}
              onClick={() => onChangeActiveTool("shapes")}
            />
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={Type}
              label="النص"
              isActive={activeTool === "text"}
              onClick={() => onChangeActiveTool("text")}
            />
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={CloudUpload}
              label="التحميلات"
              isActive={activeTool === "images"}
              onClick={() => onChangeActiveTool("images")}
            />
          </li>
          {/* Magic Button - Canva Style */}
          <li className="snap-center min-w-[70px]">
            <div className="flex flex-col items-center justify-center h-full px-2">
                <button 
                  onClick={() => onChangeActiveTool("ai")}
                  className={cn(
                    "size-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all",
                    activeTool === "ai" && "ring-4 ring-purple-100"
                  )}
                >
                    <Sparkles className="size-6" />
                </button>
                <span className="text-[10px] font-bold text-slate-500 mt-1 whitespace-nowrap uppercase tracking-tighter">الذكاء</span>
            </div>
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={Pencil}
              label="الرسم"
              isActive={activeTool === "draw"}
              onClick={() => onChangeActiveTool("draw")}
            />
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={Grab}
              label="اليد"
              isActive={activeTool === "hand"}
              onClick={() => onChangeActiveTool("hand")}
            />
          </li>
          <li className="snap-center min-w-[70px]">
            <SidebarItem
              icon={Settings}
              label="الإعدادات"
              isActive={activeTool === "settings"}
              onClick={() => onChangeActiveTool("settings")}
            />
          </li>
        </ul>
      </div>

      {/* Desktop Navigation */}
      <ScrollArea className="hidden lg:block flex-1 w-full h-full">
        <ul className="flex flex-col gap-y-1 p-2">
          <SidebarItem
            icon={LayoutGrid}
            label="التصميم"
            isActive={activeTool === "templates"}
            onClick={() => onChangeActiveTool("templates")}
          />
          <SidebarItem
            icon={Shapes}
            label="العناصر"
            isActive={activeTool === "shapes"}
            onClick={() => onChangeActiveTool("shapes")}
          />
          <SidebarItem
            icon={Type}
            label="النص"
            isActive={activeTool === "text"}
            onClick={() => onChangeActiveTool("text")}
          />
          <SidebarItem
            icon={CloudUpload}
            label="التحميلات"
            isActive={activeTool === "images"}
            onClick={() => onChangeActiveTool("images")}
          />
          <SidebarItem
            icon={Sparkles}
            label="الذكاء"
            isActive={activeTool === "ai"}
            onClick={() => onChangeActiveTool("ai")}
          />
          <SidebarItem
            icon={Pencil}
            label="الرسم"
            isActive={activeTool === "draw"}
            onClick={() => onChangeActiveTool("draw")}
          />
          <SidebarItem
            icon={Smile}
            label="إيموجي"
            isActive={activeTool === "emoji"}
            onClick={() => onChangeActiveTool("emoji")}
          />
          <SidebarItem
            icon={Sticker}
            label="أيقونات"
            isActive={activeTool === "icon"}
            onClick={() => onChangeActiveTool("icon")}
          />
          <SidebarItem
            icon={Grab}
            label="اليد"
            isActive={activeTool === "hand"}
            onClick={() => onChangeActiveTool("hand")}
          />
          <div className="mt-auto pt-2 border-t border-gray-100">
            <SidebarItem
              icon={Settings}
              label="الإعدادات"
              isActive={activeTool === "settings"}
              onClick={() => onChangeActiveTool("settings")}
            />
          </div>
        </ul>
      </ScrollArea>
    </aside>
  );
};


