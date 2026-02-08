
import * as fabric from "fabric";
import { useCallback } from "react";
import { TEXT_OPTIONS, FONT_SIZE, FONT_WEIGHT, ITextboxOptions } from "@/features/editor/types";
import { isTextType } from "@/features/editor/utils";
import { 
  addToCanvas, 
  modifyActiveObjects, 
  getActiveProperty 
} from "@/features/editor/utils/editor-actions";

interface UseEditorTextProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
  fillColor: string;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  save: () => void;
}

export const useEditorText = ({
  canvas,
  selectedObjects,
  fillColor,
  fontFamily,
  setFontFamily,
  save,
}: UseEditorTextProps) => {

  const addText = useCallback((value: string, options?: ITextboxOptions) => {
    const toolOptions = { ...TEXT_OPTIONS, ...options };
    // @ts-ignore
    delete toolOptions.type;

    const object = new fabric.Textbox(value, {
      ...toolOptions,
      fill: fillColor,
    });
    
    addToCanvas(object, canvas);
  }, [canvas, fillColor]);

  const changeFontSize = useCallback((value: number) => {
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontSize: value });
        }
    });
    save();
  }, [canvas, save]);

  const changeTextAlign = useCallback((value: string) => {
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ textAlign: value });
        }
    });
    save();
  }, [canvas, save]);

  const changeFontUnderline = useCallback((value: boolean) => {
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ underline: value });
        }
    });
    save();
  }, [canvas, save]);

  const changeFontLinethrough = useCallback((value: boolean) => {
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ linethrough: value });
        }
    });
    save();
  }, [canvas, save]);

  const changeFontStyle = useCallback((value: string) => {
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontStyle: value });
        }
    });
    save();
  }, [canvas, save]);

  const changeFontWeight = useCallback((value: number) => {
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
            // @ts-ignore
          object.set({ fontWeight: value });
        }
    });
    save();
  }, [canvas, save]);

  const changeFontFamily = useCallback((value: string) => {
    setFontFamily(value);
    modifyActiveObjects(canvas, (object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontFamily: value });
        }
    });
    save();
  }, [canvas, save, setFontFamily]);
  
  const getActiveFontSize = useCallback(() => {
    return getActiveProperty(selectedObjects, "fontSize", FONT_SIZE);
  }, [selectedObjects]);

  const getActiveTextAlign = useCallback(() => {
    return getActiveProperty(selectedObjects, "textAlign", "left");
  }, [selectedObjects]);

  const getActiveFontUnderline = useCallback(() => {
    return getActiveProperty(selectedObjects, "underline", false);
  }, [selectedObjects]);

  const getActiveFontLinethrough = useCallback(() => {
    return getActiveProperty(selectedObjects, "linethrough", false);
  }, [selectedObjects]);

  const getActiveFontStyle = useCallback(() => {
    return getActiveProperty(selectedObjects, "fontStyle", "normal");
  }, [selectedObjects]);

  const getActiveFontWeight = useCallback(() => {
    return getActiveProperty(selectedObjects, "fontWeight", FONT_WEIGHT);
  }, [selectedObjects]);

  const getActiveFontFamily = useCallback(() => {
    return getActiveProperty(selectedObjects, "fontFamily", fontFamily);
  }, [selectedObjects, fontFamily]);

  return {
    addText,
    changeFontSize,
    changeTextAlign,
    changeFontUnderline,
    changeFontLinethrough,
    changeFontStyle,
    changeFontWeight,
    changeFontFamily,
    getActiveFontSize,
    getActiveTextAlign,
    getActiveFontUnderline,
    getActiveFontLinethrough,
    getActiveFontStyle,
    getActiveFontWeight,
    getActiveFontFamily
  };
};
