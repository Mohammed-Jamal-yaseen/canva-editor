
import { 
  Editor, 
  STROKE_COLOR, 
  STROKE_WIDTH
} from "@/features/editor/types";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle 
} from "@/shared/components/ui/drawer";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { 
    X, 
    Check, 
    Settings2, 
    Palette, 
    PenTool, 
    Highlighter 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface DrawSidebarMobileProps {
  editor: Editor | undefined;
  activeTool: string;
  onClose: () => void;
}

export const DrawSidebarMobile = ({
  editor,
  activeTool,
  onClose,
}: DrawSidebarMobileProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  
  // Brush types simulation
  const [brushType, setBrushType] = useState<"pen" | "marker" | "highlighter">("pen");

  const colorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const opacityValue = editor?.getActiveOpacity() || 1;

  const onColorChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  const onWidthChange = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onOpacityChange = (value: number) => {
    editor?.changeOpacity(value);
  };

  const handleBrushSelect = (type: "pen" | "marker" | "highlighter") => {
      setBrushType(type);
      if (type === "pen") {
          editor?.changeStrokeWidth(2);
          editor?.changeOpacity(1);
      } else if (type === "marker") {
          editor?.changeStrokeWidth(10);
          editor?.changeOpacity(1);
      } else if (type === "highlighter") {
          editor?.changeStrokeWidth(20);
          editor?.changeOpacity(0.5);
      }
  };

  return (
    <>
      {/* Floating Toolbar Pill */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl border px-4 py-2 z-[50] flex items-center gap-x-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Brush Selector */}
        <div className="flex items-center gap-x-1 border-r pr-4">
            <button 
                onClick={() => handleBrushSelect("pen")}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    brushType === "pen" ? "bg-slate-100 text-blue-600" : "text-slate-500"
                )}
            >
                <PenTool className="size-5" />
            </button>
            <button 
                onClick={() => handleBrushSelect("marker")}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    brushType === "marker" ? "bg-slate-100 text-blue-600" : "text-slate-500"
                )}
            >
                <PenTool className="size-6 stroke-[3px]" />
            </button>
             <button 
                onClick={() => handleBrushSelect("highlighter")}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    brushType === "highlighter" ? "bg-slate-100 text-blue-600" : "text-slate-500"
                )}
            >
                <Highlighter className="size-5" />
            </button>
        </div>

        {/* Settings Toggles */}
        <div className="flex items-center gap-x-2">
            <button 
                onClick={() => setColorOpen(true)}
                className="relative size-8 rounded-full border border-slate-200 overflow-hidden"
            >
                <div 
                    className="absolute inset-0" 
                    style={{ backgroundColor: colorValue }}
                />
            </button>

            <button 
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-full text-slate-600 hover:bg-slate-100"
            >
                <Settings2 className="size-5" />
            </button>
        </div>

        {/* Close / Done */}
        <div className="border-l pl-4 ml-2">
            <button 
                onClick={onClose}
                className="p-2 rounded-full bg-black text-white hover:bg-slate-800"
            >
                <Check className="size-4" />
            </button>
        </div>
      </div>

      {/* Settings Drawer */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent>
            <DrawerHeader className="text-center">
                <DrawerTitle>إعدادات الرسم</DrawerTitle>
            </DrawerHeader>
            <div className="p-6 space-y-6">
                 {/* Width Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>سُمك الخط</Label>
                        <span className="text-sm text-muted-foreground">{widthValue}px</span>
                    </div>
                    <Slider
                        value={[widthValue]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => onWidthChange(values[0])}
                    />
                </div>

                 {/* Opacity Slider */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>الشفافية</Label>
                        <span className="text-sm text-muted-foreground">{Math.round(opacityValue * 100)}%</span>
                    </div>
                    <Slider
                        value={[opacityValue]}
                        min={0.1}
                        max={1}
                        step={0.01}
                        onValueChange={(values) => onOpacityChange(values[0])}
                    />
                </div>
            </div>
        </DrawerContent>
      </Drawer>

      {/* Color Drawer */}
      <Drawer open={colorOpen} onOpenChange={setColorOpen}>
        <DrawerContent className="max-h-[80vh]">
            <DrawerHeader className="text-center">
                <DrawerTitle>لون الفرشاة</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto">
                <ColorPicker
                    value={colorValue}
                    onChange={onColorChange}
                />
            </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
