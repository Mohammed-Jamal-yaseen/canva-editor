import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Loader, Upload } from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { useGetImages } from "@/features/images/api/use-get-images";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { UploadButton } from "@/shared/lib/uploadthing";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({ editor, activeTool, onChangeActiveTool }: ImageSidebarProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetImages(search);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-full lg:w-[300px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Images" description="Add images to your canvas" />
      <div className="p-4 border-b space-y-4">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            className="w-full h-10 pl-3 pr-3 text-sm bg-slate-100 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url);
            setIsUploading(false);
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          onUploadError={() => {
            setIsUploading(false);
          }}
        />
        <div className="relative w-full">
           <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setIsUploading(true);
                  const url = URL.createObjectURL(file);
                  editor?.addImage(url);
                  setIsUploading(false);
                }
              }}
           />
           <label 
             htmlFor="file-upload"
             className={cn(
                "flex items-center justify-center w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium rounded-md cursor-pointer transition-colors border border-slate-200",
                isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
             )}
           >
             {isUploading ? (
                <Loader className="size-4 animate-spin mr-2" />
             ) : (
                <Upload className="size-4 mr-2" />
             )}
             {isUploading ? "Uploading..." : "Select from computer"}
           </label>
        </div>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">Failed to fetch images</p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data &&
              data.map((image: any) => {
                return (
                  <button
                    onClick={() => editor?.addImage(image.urls.regular)}
                    key={image.id}
                    className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <img
                      src={image?.urls?.small || image?.urls?.thumb}
                      alt={image.alt_description || "Image"}
                      className="object-cover"
                      loading="lazy"
                    />
                    <Link
                      target="_blank"
                      href={image.links.html}
                      className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                    >
                      {image.user.name}
                    </Link>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
