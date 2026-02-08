
import { useEffect, useState } from "react";
import { Editor } from "@/features/editor/types";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignVerticalJustifyCenter, 
  AlignHorizontalJustifyCenter, 
  ArrowUpFromLine,
  ArrowDownFromLine,
  Trash2,
  Copy,
  ClipboardPaste,
  X
} from "lucide-react";
import { useMedia } from "react-use"; // Ensure react-use is installed/available
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";


interface PropertiesSidebarProps {
  editor: Editor | undefined;
  sidebarWidth?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PropertiesSidebar = ({ editor, open, onOpenChange }: PropertiesSidebarProps) => {
  const isMobile = useMedia("(max-width: 1024px)", false);
  const selectedObject = editor?.selectedObjects?.[0];

  const [properties, setProperties] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    rx: 0,
    opacity: 1,
  });

  useEffect(() => {
    if (!selectedObject) return;

    const updateProperties = () => {
      setProperties({
        left: Math.round(selectedObject.left || 0),
        top: Math.round(selectedObject.top || 0),
        width: Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1)),
        height: Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1)),
        angle: Math.round(selectedObject.angle || 0),
        scaleX: selectedObject.scaleX || 1,
        scaleY: selectedObject.scaleY || 1,
        rx: (selectedObject as any).rx || 0,
        opacity: selectedObject.opacity || 1,
      });
    };

    updateProperties();

    // Listen for changes
    editor?.canvas.on("object:modified", updateProperties);
    editor?.canvas.on("selection:updated", updateProperties);
    editor?.canvas.on("selection:created", updateProperties);

    return () => {
        editor?.canvas.off("object:modified", updateProperties);
        editor?.canvas.off("selection:updated", updateProperties);
        editor?.canvas.off("selection:created", updateProperties);
    }
  }, [editor, selectedObject]);

  if (!editor || !selectedObject) return null;

  const handleChange = (key: string, value: number) => {
      if(!selectedObject) return;
      
      const newProps = { ...properties, [key]: value };
      setProperties(newProps);

      if (key === "width") {
          selectedObject.set("scaleX", value / (selectedObject.width || 1));
      } else if (key === "height") {
          selectedObject.set("scaleY", value / (selectedObject.height || 1));
      } else if (key === "rx") {
          selectedObject.set("rx", value);
          selectedObject.set("ry", value);
      } else {
          selectedObject.set(key, value);
      }
      
      selectedObject.setCoords();
      editor.canvas.requestRenderAll();
      editor.onSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: string, value: string) => {
      if (e.key === "Enter") {
          handleChange(key, parseFloat(value));
      }
  }

  const isRect = selectedObject.type === "rect";

  const content = (
      <div className="space-y-4">
          {!isMobile && (
              <div className="flex items-center justify-between pb-2 border-b">
                 <p className="text-sm font-bold text-slate-800">الخصائص</p>
                 <Button variant="ghost" size="icon" className="size-6" onClick={() => onOpenChange(false)}>
                     <X className="size-4" />
                 </Button>
              </div>
          )}

          {/* Quick Actions */}
           <div className="grid grid-cols-2 gap-2">
                 <Button variant="outline" size="sm" className="w-full text-xs gap-1 h-8 px-2" onClick={() => editor.onCopy()}>
                     <Copy className="size-3" /> نسخ
                 </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1 h-8 px-2" onClick={() => editor.onPaste()}>
                     <ClipboardPaste className="size-3" /> لصق
                 </Button>
           </div>
    
          {/* Alignment */}
          <div className="space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">تحاذي</p>
                <div className="grid grid-cols-3 gap-1">
                    <Button variant="ghost" size="icon" className="size-7 rounded-sm" onClick={() => editor.align("left")}>
                        <AlignLeft className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 rounded-sm" onClick={() => editor.align("center")}>
                        <AlignHorizontalJustifyCenter className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 rounded-sm" onClick={() => editor.align("right")}>
                        <AlignRight className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 rounded-sm" onClick={() => editor.align("top")}>
                         <ArrowUpFromLine className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 rounded-sm" onClick={() => editor.align("middle")}>
                         <AlignVerticalJustifyCenter className="size-3.5" />
                    </Button>
                     <Button variant="ghost" size="icon" className="size-7 rounded-sm" onClick={() => editor.align("bottom")}>
                         <ArrowDownFromLine className="size-3.5" />
                    </Button>
                </div>
          </div>
    
          {/* Transform */}
          <div className="space-y-3 pt-2 border-t">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">الموقع والحجم</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                 <div className="space-y-0.5 relative">
                     <Label className="text-[10px] text-muted-foreground absolute left-2 top-2.5 pointer-events-none">X</Label>
                     <Input 
                        className="h-8 pl-6 text-xs"
                        type="number" 
                        value={properties.left}
                        onChange={(e) => setProperties({...properties, left: parseFloat(e.target.value)})}
                        onBlur={(e) => handleChange("left", parseFloat(e.target.value))}
                        onKeyDown={(e) => handleKeyDown(e, "left", (e.target as HTMLInputElement).value)}
                     />
                 </div>
                 <div className="space-y-0.5 relative">
                     <Label className="text-[10px] text-muted-foreground absolute left-2 top-2.5 pointer-events-none">Y</Label>
                     <Input 
                        className="h-8 pl-6 text-xs"
                        type="number" 
                        value={properties.top}
                        onChange={(e) => setProperties({...properties, top: parseFloat(e.target.value)})}
                        onBlur={(e) => handleChange("top", parseFloat(e.target.value))}
                        onKeyDown={(e) => handleKeyDown(e, "top", (e.target as HTMLInputElement).value)}
                     />
                 </div>
                 <div className="space-y-0.5 relative">
                     <Label className="text-[10px] text-muted-foreground absolute left-2 top-2.5 pointer-events-none">W</Label>
                     <Input 
                        className="h-8 pl-6 text-xs"
                        type="number" 
                        value={properties.width}
                        onChange={(e) => setProperties({...properties, width: parseFloat(e.target.value)})}
                        onBlur={(e) => handleChange("width", parseFloat(e.target.value))}
                        onKeyDown={(e) => handleKeyDown(e, "width", (e.target as HTMLInputElement).value)}
                     />
                 </div>
                 <div className="space-y-0.5 relative">
                     <Label className="text-[10px] text-muted-foreground absolute left-2 top-2.5 pointer-events-none">H</Label>
                     <Input 
                        className="h-8 pl-6 text-xs"
                        type="number" 
                        value={properties.height}
                        onChange={(e) => setProperties({...properties, height: parseFloat(e.target.value)})}
                        onBlur={(e) => handleChange("height", parseFloat(e.target.value))}
                        onKeyDown={(e) => handleKeyDown(e, "height", (e.target as HTMLInputElement).value)}
                     />
                 </div>
                 <div className="space-y-0.5 relative col-span-2">
                     <Label className="text-[10px] text-muted-foreground absolute left-2 top-2.5 pointer-events-none">Rotation</Label>
                     <Input 
                        className="h-8 pl-16 text-xs"
                        type="number" 
                        value={properties.angle}
                        onChange={(e) => setProperties({...properties, angle: parseFloat(e.target.value)})}
                        onBlur={(e) => handleChange("angle", parseFloat(e.target.value))}
                        onKeyDown={(e) => handleKeyDown(e, "angle", (e.target as HTMLInputElement).value)}
                     />
                 </div>
                 {(isRect || properties.rx > 0) && (
                     <div className="space-y-0.5 relative col-span-2">
                        <Label className="text-[10px] text-muted-foreground absolute left-2 top-2.5 pointer-events-none">Radius</Label>
                        <Input 
                            className="h-8 pl-14 text-xs"
                            type="number" 
                            value={properties.rx}
                            onChange={(e) => setProperties({...properties, rx: parseFloat(e.target.value)})}
                            onBlur={(e) => handleChange("rx", parseFloat(e.target.value))}
                            onKeyDown={(e) => handleKeyDown(e, "rx", (e.target as HTMLInputElement).value)}
                        />
                    </div>
                 )}
              </div>
          </div>
    
           {/* Appearance */}
           <div className="space-y-3 pt-2 border-t">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">الشفافية (Opacity)</p>
              <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{Math.round(properties.opacity * 100)}%</span>
                    </div>
                    <Slider 
                        value={[properties.opacity]} 
                        max={1} 
                        min={0} 
                        step={0.01}
                        onValueChange={(vals) => handleChange("opacity", vals[0])}
                    />
                  </div>
              </div>
           </div>
    
            <div className="pt-2 border-t mt-auto">
                 <Button variant="ghost" className="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-8" onClick={() => editor.delete()}>
                     <Trash2 className="size-3.5" /> حذف العنصر
                 </Button>
           </div>
      </div>
  );

  if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4 pt-1 max-h-[85vh] overflow-y-auto">
                <DrawerHeader className="text-right p-0 pb-4">
                    <DrawerTitle>الخصائص</DrawerTitle>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
      );
  }

  if (!open) return null;

  return (
    <div className="flex flex-col p-4 space-y-4 bg-white h-full w-[240px] shadow-sm border-l overflow-y-auto flex relative">
      {content}
    </div>
  );
};
