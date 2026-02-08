import { useState } from "react";

import { 
  FaBold, 
  FaItalic, 
  FaStrikethrough, 
  FaUnderline
} from "react-icons/fa";
import { TbColorFilter } from "react-icons/tb";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Trash,
  SquareSplitHorizontal,
  Copy,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  LayoutGrid,
  Lock,
  Unlock,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  MoreHorizontal,
  Focus,
  Settings
} from "lucide-react";


import { isTextType } from "@/features/editor/utils";
import { FontSizeInput } from "@/features/editor/components/font-size-input";
import { 
  ActiveTool, 
  Editor, 
  FONT_SIZE, 
  FONT_WEIGHT
} from "@/features/editor/types";

import { cn } from "@/shared/lib/utils";
import { Hint } from "@/shared/components/hint";
import { Button } from "@/shared/components/ui/button";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontLinethrough = editor?.getActiveFontLinethrough();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontLinethrough: initialFontLinethrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
  });

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const isText = isTextType(selectedObjectType);
  const isImage = selectedObjectType === "image";

  // Check if object is locked
  const isLocked = (selectedObject as any)?.get("locked") === true;

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  const toggleBold = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontWeight > 500 ? 400 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((current: any) => ({
      ...current,
      fontWeight: newValue,
    }));
  };

  const toggleItalic = () => {
    if (!selectedObject) {
      return;
    }

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current: any) => ({
      ...current,
      fontStyle: newValue,
    }));
  };

  const toggleLinethrough = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontLinethrough ? false : true;

    editor?.changeFontLinethrough(newValue);
    setProperties((current: any) => ({
      ...current,
      fontLinethrough: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((current: any) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  const toggleLock = () => {
    if (!selectedObject) {
      return;
    }

    editor?.toggleLock();
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b dark:border-slate-800 bg-white dark:bg-[#18191b] dark:bg-slate-900 w-full flex items-center overflow-x-auto no-scrollbar z-[49] p-2 gap-x-2">
         <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="إعدادات الصفحة" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("settings")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "settings" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <Settings className="size-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="إعادة ضبط العرض" side="bottom" sideOffset={5}>
            <Button
              onClick={() => editor?.autoZoom()}
              size="icon"
              variant="ghost"
            >
              <Focus className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b dark:border-slate-800 bg-white dark:bg-slate-900 w-full flex items-center overflow-x-auto overflow-y-hidden no-scrollbar z-[49] p-2 gap-x-2">
      {!isImage && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="اللون" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "fill" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <div
                className="rounded-sm size-4 border"
                style={{ backgroundColor: properties.fillColor }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {!isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="لون الإطار" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-color")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "stroke-color" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <div
                className="rounded-sm size-4 border-2 bg-white dark:bg-slate-900"
                style={{ borderColor: properties.strokeColor }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {!isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="سُمك الإطار" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-width")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "stroke-width" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <BsBorderWidth className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="الخط" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size="icon"
              variant="ghost"
              className={cn(
                "w-auto px-2 text-sm",
                activeTool === "font" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <div className="max-w-[100px] truncate">
                {properties.fontFamily}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="عريض" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleBold}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontWeight > 500 && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <FaBold className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="مائل" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleItalic}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontStyle === "italic" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="تحته خط" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleUnderline}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontUnderline && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="خط في الوسط" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleLinethrough}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontLinethrough && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="محاذاة لليسار" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("left")}
              size="icon"
              variant="ghost"
              className={cn(
                properties.textAlign === "left" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="محاذاة للوسط" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("center")}
              size="icon"
              variant="ghost"
              className={cn(
                properties.textAlign === "center" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="محاذاة لليمين" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("right")}
              size="icon"
              variant="ghost"
              className={cn(
                properties.textAlign === "right" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center shrink-0">
          <FontSizeInput
            value={properties.fontSize}
            onChange={onChangeFontSize}
          />
        </div>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="الفلاتر" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("filter")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "filter" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="إزالة الخلفية" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("remove-bg")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "remove-bg" && "bg-gray-100 dark:bg-slate-800"
              )}
            >
              <SquareSplitHorizontal className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="تقديم للأمام" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="إرسال للخلف" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="الشفافية" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100 dark:bg-slate-800")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="تكرار" side="bottom" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label={isLocked ? "فك القفل" : "قفل"} side="bottom" sideOffset={5}>
          <Button
            onClick={() => isLocked ? editor?.unlock() : editor?.lock()}
            size="icon"
            variant="ghost"
            className={cn(isLocked && "bg-gray-100 dark:bg-slate-800")}
          >
            {isLocked ? <Unlock className="size-4" /> : <Lock className="size-4" />}
          </Button>
        </Hint>
      </div>

      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="تركيز" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.zoomToSelected()}
            size="icon"
            variant="ghost"
          >
            <Focus className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="حذف" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
            className="text-red-600"
          >
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
      
      {/* Separator */}
      <div className="w-[1px] h-8 bg-gray-200 dark:bg-slate-700 mx-2 shrink-0" />

      {/* Object Alignment */}
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="محاذاة لليسار" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.align("left")} size="icon" variant="ghost">
            <AlignLeft className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="محاذاة للوسط" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.align("center")} size="icon" variant="ghost">
             <AlignCenter className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="محاذاة لليمين" side="bottom" sideOffset={5}>
           <Button onClick={() => editor?.align("right")} size="icon" variant="ghost">
             <AlignRight className="size-4" />
           </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="محاذاة للأعلى" side="bottom" sideOffset={5}>
           <Button onClick={() => editor?.align("top")} size="icon" variant="ghost">
             <AlignVerticalJustifyStart className="size-4" />
           </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="محاذاة للمنتصف" side="bottom" sideOffset={5}>
           <Button onClick={() => editor?.align("middle")} size="icon" variant="ghost">
             <AlignVerticalJustifyCenter className="size-4" />
           </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center shrink-0">
        <Hint label="محاذاة للأسفل" side="bottom" sideOffset={5}>
           <Button onClick={() => editor?.align("bottom")} size="icon" variant="ghost">
             <AlignVerticalJustifyEnd className="size-4" />
           </Button>
        </Hint>
      </div>

      {editor?.selectedObjects && editor.selectedObjects.length > 2 && (
        <div className="flex items-center h-full gap-x-2 shrink-0">
            <div className="flex items-center h-full justify-center">
                <Hint label="توزيع أفقي" side="bottom" sideOffset={5}>
                <Button onClick={() => editor?.align("distribute-horizontal")} size="icon" variant="ghost">
                    <AlignHorizontalDistributeCenter className="size-4" />
                </Button>
                </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
                <Hint label="توزيع رأسي" side="bottom" sideOffset={5}>
                <Button onClick={() => editor?.align("distribute-vertical")} size="icon" variant="ghost">
                    <AlignVerticalDistributeCenter className="size-4" />
                </Button>
                </Hint>
            </div>
        </div>
      )}

       {/* Grouping */}
       {editor?.selectedObjects && editor.selectedObjects.length > 1 && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="تجميع" side="bottom" sideOffset={5}>
            <Button onClick={() => editor?.groupObjects()} size="icon" variant="ghost">
              <span className="text-xs font-semibold px-2">تجميع</span>
            </Button>
          </Hint>
        </div>
      )}
      {selectedObjectType === "group" && (
        <div className="flex items-center h-full justify-center shrink-0">
          <Hint label="فك التجميع" side="bottom" sideOffset={5}>
            <Button onClick={() => editor?.ungroupObjects()} size="icon" variant="ghost">
               <span className="text-xs font-semibold px-2">فك تجميع</span>
            </Button>
          </Hint>
        </div>
      )}
    </div>
  );
};
