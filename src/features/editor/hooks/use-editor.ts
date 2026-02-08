import * as fabric from "fabric";
import { useCallback, useState, useMemo, useRef } from "react";

import { 
  Editor, 
  FILL_COLOR,
  STROKE_WIDTH,
  STROKE_COLOR,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  TRIANGLE_OPTIONS,
  BuildEditorProps, 
  RECTANGLE_OPTIONS,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  JSON_KEYS,
} from "@/features/editor/types";
import { useHistory } from "@/features/editor/hooks/use-history";
import { 
  createFilter, 
  downloadFile, 
  isTextType,
  transformText
} from "@/features/editor/utils";
import { useHotkeys } from "@/features/editor/hooks/use-hotkeys";
import { useClipboard } from "@/features/editor/hooks/use-clipboard";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { useWindowEvents } from "@/features/editor/hooks/use-window-events";
import { useLoadState } from "@/features/editor/hooks/use-load-state";

const buildEditor = ({
  save,
  undo,
  redo,
  canRedo,
  canUndo,
  autoZoom,
  copy,
  paste,
  canvas,
  fillColor,
  fontFamily,
  setFontFamily,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
  pages,
  setPages,
  zoom,
  setZoom,
  currentPage,
  setCurrentPage,
}: BuildEditorProps & { zoom: number; currentPage: number; pages: string[] }): Editor => {
  const generateSaveOptions = () => {
    const workspace = getWorkspace() as fabric.Rect;
    const { width = 0, height = 0, left = 0, top = 0 } = workspace || {};

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    // @ts-expect-error - Fabric 7 type mismatch
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    // @ts-expect-error - Fabric 7 type mismatch
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "svg");
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    // @ts-expect-error - Fabric 7 type mismatch
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "jpg");
    autoZoom();
  };

  const saveJson = async () => {
    // @ts-expect-error - Fabric 7 type mismatch
    const dataUrl = canvas.toJSON(JSON_KEYS);

    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t"),
    )}`;
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data).then(() => {
      autoZoom();
      canvas.renderAll();
      save();
    });
  };

  const getWorkspace = () => {
    let workspace = canvas
      .getObjects()
      .find((object) => (object as any).name === "clip");
    
    if (!workspace) {
      workspace = canvas.getObjects().find((object) => 
        object.type === "rect" && !object.selectable && !object.hasControls
      );

      if (workspace) {
        (workspace as any).name = "clip";
      }
    }

    return workspace;
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    savePng,
    saveJpg,
    saveSvg,
    saveJson,
    loadJson,
    canUndo,
    canRedo,
    autoZoom,
    getWorkspace,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.1;
      const center = canvas.getVpCenter();
      const newZoom = zoomRatio > 10 ? 10 : zoomRatio;
      canvas.zoomToPoint(
        new fabric.Point(center.x, center.y),
        newZoom
      );
      setZoom(newZoom);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.1;
      const center = canvas.getVpCenter();
      const newZoom = zoomRatio < 0.1 ? 0.1 : zoomRatio;
      canvas.zoomToPoint(
        new fabric.Point(center.x, center.y),
        newZoom,
      );
      setZoom(newZoom);
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set(value);
      autoZoom();
      save();
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.FabricImage.fromURL(
        value,
        {
          crossOrigin: value.startsWith("data:") || value.startsWith("blob:") ? undefined : "anonymous",
        },
      ).then((image) => {
        const workspace = getWorkspace();

        // Scale image to fit within workspace while maintaining aspect ratio
        const workspaceWidth = workspace?.width || 800;
        const workspaceHeight = workspace?.height || 1000;
        
        if (image.width && image.height) {
          const scale = Math.min(
            workspaceWidth / image.width,
            workspaceHeight / image.height,
            1 // Don't scale up, only down
          );
          image.scale(scale);
        }

        addToCanvas(image);
      });
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
      save();
    },
    clear: () => {
      canvas.getObjects().forEach((object) => {
        if ((object as any).name !== "clip") {
          canvas.remove(object);
        }
      });
      canvas.discardActiveObject();
      canvas.renderAll();
      save();
    },
    addText: (value, options) => {
      const toolOptions = { ...TEXT_OPTIONS, ...options };
      // Fabric.js logic often overrides type, we must clean it to avoid runtime error on "type" setter
      // @ts-ignore
      delete toolOptions.type;

      const object = new fabric.Textbox(value, {
        ...toolOptions,
        fill: fillColor,
      });

      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") || 1;

      return value;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, fontSize exists.
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      // Faulty TS library, fontSize exists.
      const value = selectedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, textAlign exists.
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      // Faulty TS library, textAlign exists.
      const value = selectedObject.get("textAlign") || "left";

      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, underline exists.
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // Faulty TS library, underline exists.
      const value = selectedObject.get("underline") || false;

      return value;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, linethrough exists.
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // Faulty TS library, linethrough exists.
      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, fontStyle exists.
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      // Faulty TS library, fontStyle exists.
      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, fontWeight exists.
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object);
      });

      canvas.renderAll();
      
      const workspace = getWorkspace();
      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // Faulty TS library, fontFamily exists.
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // Text types don't have stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = value;
      }
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = value;
      }
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      // Faulty TS library, fontWeight exists.
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      // Faulty TS library, fontFamily exists.
      const value = selectedObject.get("fontFamily") || fontFamily;

      return value;
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;

      // Currently, gradients & patterns are not supported
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeColor;
      }

      const value = selectedObject.get("stroke") || strokeColor;

      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") || strokeWidth;

      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashArray;
      }

      const value = selectedObject.get("strokeDashArray") || strokeDashArray;

      return value;
    },
    selectedObjects,
    groupObjects: () => {
      if (!canvas.getActiveObject()) {
        return;
      }

      const activeObject = canvas.getActiveObject();

      if (!activeObject || activeObject.type !== "activeSelection") {
        return;
      }

      const group = (activeObject as any).toGroup();
      
      canvas.setActiveObject(group);
      
      // Force update
      const selectedObject = canvas.getActiveObjects();
      // @ts-ignore
      canvas.fire("selection:updated", { selected: selectedObject });
      
      canvas.renderAll();
      save();
    },
    ungroupObjects: () => {
      const activeObject = canvas.getActiveObject();

      if (!activeObject || activeObject.type !== "group") {
        return;
      }

      const activeSelection = (activeObject as any).toActiveSelection();
      
      canvas.setActiveObject(activeSelection);
      
      // Force update
      const selectedObject = canvas.getActiveObjects();
      // @ts-ignore
      canvas.fire("selection:updated", { selected: selectedObject });

      canvas.renderAll();
      save();
    },
    lock: () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      activeObject.set({
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
      });

      // @ts-ignore
      activeObject.set("locked", true);
      
      canvas.renderAll();
      save();
    },
    unlock: () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      activeObject.set({
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
      });

      // @ts-ignore
      activeObject.set("locked", false);

      canvas.renderAll();
      save();
    },
    align: (position: "left" | "center" | "right" | "top" | "middle" | "bottom" | "distribute-horizontal" | "distribute-vertical") => {
      const activeObject = canvas.getActiveObject();
      const workspace = getWorkspace();

      if (!activeObject || !workspace) return;

      const workspaceWidth = workspace.width! * workspace.scaleX!;
      const workspaceHeight = workspace.height! * workspace.scaleY!;
      const workspaceLeft = workspace.left!;
      const workspaceTop = workspace.top!;

      if (position === "left") {
        activeObject.set({ left: workspaceLeft });
      }

      if (position === "right") {
        activeObject.set({ left: workspaceLeft + workspaceWidth - activeObject.width! * activeObject.scaleX! });
      }

      if (position === "center") {
        activeObject.set({ left: workspaceLeft + (workspaceWidth - activeObject.width! * activeObject.scaleX!) / 2 });
      }

      if (position === "top") {
        activeObject.set({ top: workspaceTop });
      }

      if (position === "bottom") {
        activeObject.set({ top: workspaceTop + workspaceHeight - activeObject.height! * activeObject.scaleY! });
      }

      if (position === "middle") {
        activeObject.set({ top: workspaceTop + (workspaceHeight - activeObject.height! * activeObject.scaleY!) / 2 });
      }

      if (position === "distribute-horizontal" && activeObject.type === "activeSelection") {
        const selection = activeObject as fabric.ActiveSelection;
        const objects = selection.getObjects().sort((a, b) => a.left - b.left);
        
        if (objects.length > 2) {
          const first = objects[0];
          const last = objects[objects.length - 1];
          const totalSpace = (last.left + last.width! * last.scaleX!) - first.left;
          const totalObjectsWidth = objects.reduce((sum, obj) => sum + obj.width! * obj.scaleX!, 0);
          const gap = (totalSpace - totalObjectsWidth) / (objects.length - 1);
          
          let currentLeft = first.left;
          objects.forEach((obj, index) => {
            if (index > 0 && index < objects.length - 1) {
              obj.set({ left: currentLeft });
            }
            currentLeft += obj.width! * obj.scaleX! + gap;
          });
        }
      }

      if (position === "distribute-vertical" && activeObject.type === "activeSelection") {
        const selection = activeObject as fabric.ActiveSelection;
        const objects = selection.getObjects().sort((a, b) => a.top - b.top);
        
        if (objects.length > 2) {
           const first = objects[0];
           const last = objects[objects.length - 1];
           const totalSpace = (last.top + last.height! * last.scaleY!) - first.top;
           const totalObjectsHeight = objects.reduce((sum, obj) => sum + obj.height! * obj.scaleY!, 0);
           const gap = (totalSpace - totalObjectsHeight) / (objects.length - 1);
           
           let currentTop = first.top;
           objects.forEach((obj, index) => {
             if (index > 0 && index < objects.length - 1) {
               obj.set({ top: currentTop });
             }
             currentTop += obj.height! * obj.scaleY! + gap;
           });
        }
      }

      canvas.renderAll();
      save();
    },
    // Page Management Functions
    addPage: (options?: { width: number; height: number }) => {
      const workspace = getWorkspace();
      const pageWidth = options?.width || workspace?.width || 800;
      const pageHeight = options?.height || workspace?.height || 1000;
      
      // Save current page state to pages array
      // @ts-expect-error - Fabric 7 type mismatch
      const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
      
      // Update pages array with current page
      const updatedPages = [...pages];
      updatedPages[currentPage] = currentState;
      
      // Add new empty page
      updatedPages.push("");
      setPages(updatedPages);
      setCurrentPage(updatedPages.length - 1);
      
      // Clear canvas except workspace
      canvas.getObjects().forEach((object) => {
        if ((object as any).name !== "clip") {
          canvas.remove(object);
        }
      });
      
      // Update or create workspace with new dimensions
      if (workspace) {
        workspace.set({ width: pageWidth, height: pageHeight });
        canvas.centerObject(workspace);
      } else {
        const newWorkspace = new fabric.Rect({
          width: pageWidth,
          height: pageHeight,
          fill: "white",
          name: "clip",
          selectable: false,
          hasControls: false,
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.8)",
            blur: 5,
          }),
        });
        
        canvas.add(newWorkspace);
        canvas.centerObject(newWorkspace);
        canvas.clipPath = newWorkspace;
      }
      
      canvas.renderAll();
      autoZoom();
      save();
    },
    deletePage: () => {
      if (pages.length <= 1) {
        // If only one page, just clear it
        canvas.getObjects().forEach((object) => {
          if ((object as any).name !== "clip") {
            canvas.remove(object);
          }
        });
        canvas.discardActiveObject();
        canvas.renderAll();
        save();
        return;
      }
      
      // Remove current page from array
      const updatedPages = pages.filter((_, index) => index !== currentPage);
      setPages(updatedPages);
      
      // Navigate to previous page or first page
      const newCurrentPage = currentPage > 0 ? currentPage - 1 : 0;
      setCurrentPage(newCurrentPage);
      
      // Load the new current page
      if (updatedPages[newCurrentPage]) {
        try {
          const pageData = JSON.parse(updatedPages[newCurrentPage]);
          canvas.loadFromJSON(pageData).then(() => {
            canvas.renderAll();
            autoZoom();
          });
        } catch (error) {
          console.error("Error loading page:", error);
        }
      } else {
        // Clear canvas if no page data
        canvas.getObjects().forEach((object) => {
          if ((object as any).name !== "clip") {
            canvas.remove(object);
          }
        });
        canvas.discardActiveObject();
        canvas.renderAll();
      }
      
      save();
    },
    nextPage: () => {
      if (currentPage >= pages.length - 1) return;
      
      // Save current page state
      // @ts-expect-error - Fabric 7 type mismatch
      const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
      const updatedPages = [...pages];
      updatedPages[currentPage] = currentState;
      setPages(updatedPages);
      
      // Navigate to next page
      const nextPageIndex = currentPage + 1;
      setCurrentPage(nextPageIndex);
      
      // Clear canvas first
      canvas.getObjects().forEach((object) => {
        if ((object as any).name !== "clip") {
          canvas.remove(object);
        }
      });

      // Load next page
      if (updatedPages[nextPageIndex] && updatedPages[nextPageIndex] !== "") {
        try {
          const pageData = JSON.parse(updatedPages[nextPageIndex]);
          canvas.loadFromJSON(pageData).then(() => {
            canvas.renderAll();
            autoZoom();
          });
        } catch (error) {
          console.error("Error loading page:", error);
        }
      } else {
        canvas.renderAll();
        autoZoom();
      }
    },
    prevPage: () => {
      if (currentPage <= 0) return;
      
      // Save current page state
      // @ts-expect-error - Fabric 7 type mismatch
      const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
      const updatedPages = [...pages];
      updatedPages[currentPage] = currentState;
      setPages(updatedPages);
      
      // Navigate to previous page
      const prevPageIndex = currentPage - 1;
      setCurrentPage(prevPageIndex);
      
      // Clear canvas first
      canvas.getObjects().forEach((object) => {
        if ((object as any).name !== "clip") {
          canvas.remove(object);
        }
      });

      // Load previous page
      if (updatedPages[prevPageIndex] && updatedPages[prevPageIndex] !== "") {
        try {
          const pageData = JSON.parse(updatedPages[prevPageIndex]);
          canvas.loadFromJSON(pageData).then(() => {
            canvas.renderAll();
            autoZoom();
          });
        } catch (error) {
          console.error("Error loading page:", error);
        }
      } else {
        canvas.renderAll();
        autoZoom();
      }
    },
    goToPage: (index: number) => {
      if (index < 0 || index >= pages.length) return;
      if (index === currentPage) return;
      
      // Save current page state
      // @ts-expect-error - Fabric 7 type mismatch
      const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
      const updatedPages = [...pages];
      updatedPages[currentPage] = currentState;
      setPages(updatedPages);
      
      // Navigate to target page
      setCurrentPage(index);
      
      // Clear canvas first
      canvas.getObjects().forEach((object) => {
        if ((object as any).name !== "clip") {
          canvas.remove(object);
        }
      });

      // Load target page
      if (updatedPages[index] && updatedPages[index] !== "") {
        try {
          const pageData = JSON.parse(updatedPages[index]);
          canvas.loadFromJSON(pageData).then(() => {
            canvas.renderAll();
            autoZoom();
          });
        } catch (error) {
          console.error("Error loading page:", error);
        }
      } else {
        // If empty page, just render workspace and autozoom
        canvas.renderAll();
        autoZoom();
      }
    },
    setZoom: (value: number) => {
      const clampedZoom = Math.min(Math.max(value, 0.1), 10);
      const center = canvas.getVpCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.x, center.y),
        clampedZoom
      );
      setZoom(clampedZoom);
    },
    toggleLock: () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      
      // @ts-ignore
      const isLocked = activeObject.get("locked");
      
      if (isLocked) {
        activeObject.set({
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
        });
        // @ts-ignore
        activeObject.set("locked", false);
      } else {
        activeObject.set({
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        });
        // @ts-ignore
        activeObject.set("locked", true);
      }
      
      canvas.renderAll();
      save();
    },
    zoomToSelected: () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      
      const center = activeObject.getCenterPoint();
      canvas.zoomToPoint(
        new fabric.Point(center.x, center.y),
        1.5
      );
    },
    // Additional Shape Functions
    addPentagon: () => {
      const points = [];
      const sides = 5;
      const radius = 50;
      
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        points.push({
          x: radius + radius * Math.cos(angle),
          y: radius + radius * Math.sin(angle),
        });
      }
      
      const object = new fabric.Polygon(points, {
        left: 100,
        top: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      
      addToCanvas(object);
    },
    addHexagon: () => {
      const points = [];
      const sides = 6;
      const radius = 50;
      
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        points.push({
          x: radius + radius * Math.cos(angle),
          y: radius + radius * Math.sin(angle),
        });
      }
      
      const object = new fabric.Polygon(points, {
        left: 100,
        top: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      
      addToCanvas(object);
    },
    addOctagon: () => {
      const points = [];
      const sides = 8;
      const radius = 50;
      
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        points.push({
          x: radius + radius * Math.cos(angle),
          y: radius + radius * Math.sin(angle),
        });
      }
      
      const object = new fabric.Polygon(points, {
        left: 100,
        top: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      
      addToCanvas(object);
    },
    addStar: () => {
      const points = [];
      const outerRadius = 50;
      const innerRadius = 25;
      const spikes = 5;
      
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        points.push({
          x: outerRadius + radius * Math.cos(angle),
          y: outerRadius + radius * Math.sin(angle),
        });
      }
      
      const object = new fabric.Polygon(points, {
        left: 100,
        top: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      
      addToCanvas(object);
    },
    addArrow: () => {
      const points = [
        { x: 0, y: 20 },
        { x: 60, y: 20 },
        { x: 60, y: 0 },
        { x: 100, y: 30 },
        { x: 60, y: 60 },
        { x: 60, y: 40 },
        { x: 0, y: 40 },
      ];
      
      const object = new fabric.Polygon(points, {
        left: 100,
        top: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      
      addToCanvas(object);
    },
    onSave: (skip = false) => save(skip, false),
    zoom,
    currentPage,
    totalPages: Math.max(pages.length, 1),
  };
};

export const useEditor = ({
  defaultState,
  defaultHeight,
  defaultWidth,
  activeTool,
  clearSelectionCallback,
  saveCallback,
}: EditorHookProps) => {
  const initialState = useRef(defaultState);
  const initialWidth = useRef(defaultWidth);
  const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
  
  // Page management state
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  useWindowEvents();

  const { 
    save, 
    canRedo, 
    canUndo, 
    undo, 
    redo,
    canvasHistoryRef,
    setHistoryIndex,
  } = useHistory({ 
    canvas,
    saveCallback
  });

  const { copy, paste } = useClipboard({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    save,
    canvas,
    activeTool,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotkeys({
    undo,
    redo,
    copy,
    paste,
    save,
    canvas,
  });

  useLoadState({
    canvas,
    autoZoom,
    initialState,
    canvasHistoryRef,
    setHistoryIndex,
  });

  const editor = useMemo(() => {
    if (canvas) {
      const editorInstance = buildEditor({
        save,
        undo,
        redo,
        canUndo,
        canRedo,
        autoZoom,
        copy,
        paste,
        canvas,
        fillColor,
        strokeWidth,
        strokeColor,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        strokeDashArray,
        selectedObjects,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        pages,
        setPages,
        zoom,
        setZoom,
        currentPage,
        setCurrentPage,
      });
      
      return editorInstance;
    }

    return undefined;
  }, 
  [
    canRedo,
    canUndo,
    undo,
    redo,
    save,
    autoZoom,
    copy,
    paste,
    canvas,
    fillColor,
    strokeWidth,
    strokeColor,
    selectedObjects,
    strokeDashArray,
    fontFamily,
    pages,
    currentPage,
    zoom,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: initialWidth.current,
        height: initialHeight.current,
        fill: "white",
        name: "clip",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(
        // @ts-expect-error - Fabric 7 type mismatch
        initialCanvas.toJSON(JSON_KEYS)
      );
      canvasHistoryRef.current = [currentState];
      setHistoryIndex(0);
      
      // Initialize pages array with first page
      setPages([currentState]);
      setCurrentPage(0);
      setZoom(1);
    },
    [
      canvasHistoryRef, // No need, this is from useRef
      setHistoryIndex, // No need, this is from useState
    ]
  );

  return { init, editor };
};
