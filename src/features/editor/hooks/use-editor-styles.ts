
import * as fabric from "fabric";
import { useCallback } from "react";
import { 
  modifyActiveObjects, 
  getActiveProperty 
} from "@/features/editor/utils/editor-actions";
import { isTextType } from "@/features/editor/utils";

interface UseEditorStylesProps {
  canvas: fabric.Canvas | null;
  save: () => void;
  selectedObjects: fabric.Object[];
  fillColor: string;
  setFillColor: (value: string) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  strokeDashArray: number[];
  setStrokeDashArray: (value: number[]) => void;
}

export const useEditorStyles = ({
  canvas,
  save,
  selectedObjects,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  strokeDashArray,
  setStrokeDashArray,
}: UseEditorStylesProps) => {

  const changeFillColor = useCallback((value: string) => {
    setFillColor(value);
    modifyActiveObjects(canvas, (object) => object.set({ fill: value }));
    save();
  }, [canvas, save, setFillColor]);

  const changeStrokeColor = useCallback((value: string) => {
    setStrokeColor(value);
    modifyActiveObjects(canvas, (object) => {
      // Text types don't have stroke, use fill
      if (isTextType(object.type)) {
        object.set({ fill: value });
        return;
      }

      object.set({ stroke: value });
    });
    // Update free drawing brush if active
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = value;
    }
    save();
  }, [canvas, save, setStrokeColor]);

  const changeStrokeWidth = useCallback((value: number) => {
    setStrokeWidth(value);
    modifyActiveObjects(canvas, (object) => object.set({ strokeWidth: value }));
    // Update free drawing brush if active
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = value;
    }
    save();
  }, [canvas, save, setStrokeWidth]);

  const changeStrokeDashArray = useCallback((value: number[]) => {
    setStrokeDashArray(value);
    modifyActiveObjects(canvas, (object) => object.set({ strokeDashArray: value }));
    save();
  }, [canvas, save, setStrokeDashArray]);

  const changeOpacity = useCallback((value: number) => {
    modifyActiveObjects(canvas, (object) => object.set({ opacity: value }));
    save();
  }, [canvas, save]);

  const getActiveFillColor = useCallback(() => {
    return getActiveProperty(selectedObjects, "fill", fillColor) as string;
  }, [selectedObjects, fillColor]);

  const getActiveStrokeColor = useCallback(() => {
    return getActiveProperty(selectedObjects, "stroke", strokeColor);
  }, [selectedObjects, strokeColor]);

  const getActiveStrokeWidth = useCallback(() => {
    return getActiveProperty(selectedObjects, "strokeWidth", strokeWidth);
  }, [selectedObjects, strokeWidth]);

  const getActiveStrokeDashArray = useCallback(() => {
    return getActiveProperty(selectedObjects, "strokeDashArray", strokeDashArray);
  }, [selectedObjects, strokeDashArray]);

  const getActiveOpacity = useCallback(() => {
    return getActiveProperty(selectedObjects, "opacity", 1);
  }, [selectedObjects]);

  return {
    changeFillColor,
    changeStrokeColor,
    changeStrokeWidth,
    changeStrokeDashArray,
    changeOpacity,
    getActiveFillColor,
    getActiveStrokeColor,
    getActiveStrokeWidth,
    getActiveStrokeDashArray,
    getActiveOpacity
  };
};
