import { Minimize, Trash, ZoomIn, ZoomOut } from "lucide-react";

import { Editor } from "@/features/editor/types";

import { Button } from "@/shared/components/ui/button";
import { Hint } from "@/shared/components/hint";
import { useConfirm } from "@/hooks/use-confirm";

interface FooterProps {
  editor: Editor | undefined;
};

export const Footer = ({ editor }: FooterProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Clear design",
    "Are you sure you want to clear the entire design? This action cannot be undone."
  );

  const onClear = async () => {
    const ok = await confirm();

    if (ok) {
        editor?.clear();
    }
  };

  return (
    <footer className="h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse">
      <ConfirmDialog />
      <Hint label="Clear design" side="top" sideOffset={10}>
        <Button
            onClick={onClear}
            size="icon"
            variant="ghost"
            className="h-full hover:bg-red-100/50 hover:text-red-500 text-muted-foreground"
        >
            <Trash className="size-4" />
        </Button>
      </Hint>
      <Hint label="Reset" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.autoZoom()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <Minimize className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom in" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.zoomIn()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomIn className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom out" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.zoomOut()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomOut className="size-4" />
        </Button>
      </Hint>
    </footer>
  );
};
