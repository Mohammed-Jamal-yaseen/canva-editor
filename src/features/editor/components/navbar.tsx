"use client";

import { useState, useEffect } from "react";

import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useFilePicker } from "use-file-picker";
import { useMutationState } from "@tanstack/react-query";
import { 
  ChevronDown, 
  Download, 
  Loader, 
  MousePointerClick, 
  Redo2, 
  Undo2,
  FileIcon,
  LayoutIcon,
  ImageIcon,
  TypeIcon,
  ChevronRight,
  Share2
} from "lucide-react";

import { UserButton } from "@/shared/components/user-nav";

import { ActiveTool, Editor } from "@/features/editor/types";
import { Logo } from "@/features/editor/components/logo";

import { cn } from "@/shared/lib/utils";
import { Hint } from "@/shared/components/hint";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface NavbarProps {
  id: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const Navbar = ({
  id,
  editor,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  const data = useMutationState({
    filters: {
      mutationKey: ["project", { id }],
      exact: true,
    },
    select: (mutation) => mutation.state.status,
  });

  const currentStatus = data[data.length - 1];

  const isError = currentStatus === "error";
  const isPending = currentStatus === "pending";

  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadJson(reader.result as string);
        };
      }
    },
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b bg-white shadow-sm sticky top-0 z-[50]">
        <div className="flex items-center gap-x-4">
          <Logo />
          <div className="hidden lg:flex items-center gap-x-2 text-sm text-muted-foreground">
             <Loader className="size-4 animate-spin text-muted-foreground" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b bg-white shadow-sm sticky top-0 z-[50]">
      <div className="flex items-center gap-x-4">
        <Logo />
        <div className="hidden lg:flex items-center gap-x-2 text-sm text-muted-foreground">
          <ChevronRight className="size-4" />
          <span className="font-medium text-foreground truncate max-w-[200px]">
             Design Project
          </span>
          <div className="flex items-center ml-2 border-l pl-4">
            {isPending && ( 
              <div className="flex items-center gap-x-2 animate-pulse text-blue-500">
                <Loader className="size-3 animate-spin" />
                <span className="text-[10px] font-medium">Syncing...</span>
              </div>
            )}
            {!isPending && isError && ( 
             <></> // Error state hidden as per request
            )}
            {!isPending && !isError && ( 
             <></> // Success state hidden as per request
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-x-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-9 font-normal hover:bg-gray-100">
              File
              <ChevronDown className="size-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 shadow-xl border-gray-100">
            <DropdownMenuItem
              onClick={() => openFilePicker()}
              className="flex items-center gap-x-3 py-3 cursor-pointer"
            >
              <div className="size-8 rounded-md bg-blue-50 flex items-center justify-center">
                <FileIcon className="size-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Open</span>
                <span className="text-[10px] text-muted-foreground line-clamp-1">Import local design</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-x-1 bg-gray-50/50 p-1 rounded-lg border border-gray-100">
          <Hint label="Cursor" sideOffset={10}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChangeActiveTool("select")}
              className={cn(
                "h-9 w-9 transition-all rounded-md",
                activeTool === "select" && "bg-white shadow-sm ring-1 ring-black/5 text-blue-600"
              )}
            >
              <MousePointerClick className="size-[18px]" />
            </Button>
          </Hint>
          <Hint label="Undo" sideOffset={10}>
            <Button
              disabled={!editor?.canUndo()}
              variant="ghost"
              size="icon"
              onClick={() => editor?.onUndo()}
              className="h-9 w-9"
            >
              <Undo2 className="size-[18px]" />
            </Button>
          </Hint>
          <Hint label="Redo" sideOffset={10}>
            <Button
              disabled={!editor?.canRedo()}
              variant="ghost"
              size="icon"
              onClick={() => editor?.onRedo()}
              className="h-9 w-9"
            >
              <Redo2 className="size-[18px]" />
            </Button>
          </Hint>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="hidden md:flex items-center gap-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
           <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
           <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.1em]">Expert Engine</span>
        </div>
      </div>

      <div className="flex items-center gap-x-3 ml-auto">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 transition-all active:scale-95 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]">
              Download
              <Download className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2 shadow-2xl border-gray-100 rounded-xl overflow-hidden">
            <div className="px-3 py-3 mb-2 bg-gray-50/50 rounded-lg">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Export your creation</p>
            </div>
            
            <DropdownMenuItem
              className="flex items-center gap-x-4 p-3 cursor-pointer rounded-lg mb-1"
              onClick={() => editor?.saveJson()}
            >
              <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <FileIcon className="size-5 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Design Source (JSON)</span>
                <span className="text-[10px] text-muted-foreground">Keep editing this file later</span>
              </div>
            </DropdownMenuItem>

            <Separator className="my-2" />

            <DropdownMenuItem
              className="flex items-center gap-x-4 p-3 cursor-pointer rounded-lg mb-1 hover:bg-blue-50 transition-colors"
              onClick={() => editor?.savePng()}
            >
              <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <ImageIcon className="size-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-blue-900">High-Res PNG</span>
                <span className="text-[10px] text-blue-600/70">Best for professional sharing</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-x-4 p-3 cursor-pointer rounded-lg mb-1 hover:bg-orange-50 transition-colors"
              onClick={() => editor?.saveJpg()}
            >
              <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <ImageIcon className="size-5 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-orange-900">Standard JPG</span>
                <span className="text-[10px] text-orange-600/70">Smaller file size for web use</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-x-4 p-3 cursor-pointer rounded-lg hover:bg-emerald-50 transition-colors"
              onClick={() => editor?.saveSvg()}
            >
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <LayoutIcon className="size-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-emerald-900">Vector SVG</span>
                <span className="text-[10px] text-emerald-600/70">Ideal for logo and line art</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-8" />
        <UserButton />
      </div>
    </nav>
  );
};
