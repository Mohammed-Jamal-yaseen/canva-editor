
import * as fabric from "fabric";
import { useCallback, useState, useMemo, useRef } from "react";

import { 
  Editor, 
  FILL_COLOR,
  STROKE_WIDTH,
  STROKE_COLOR,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  FONT_FAMILY,
  JSON_KEYS,
} from "@/features/editor/types";

import { useHistory } from "@/features/editor/hooks/use-history";
import { createFilter } from "@/features/editor/utils/filters";
import { useHotkeys } from "@/features/editor/hooks/use-hotkeys";
import { useClipboard } from "@/features/editor/hooks/use-clipboard";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { useWindowEvents } from "@/features/editor/hooks/use-window-events";
import { useLoadState } from "@/features/editor/hooks/use-load-state";

import { 
  WORKSPACE_DEFAULTS,
  EDITOR_CONTROLS,
  ZOOM_CONFIG, 
} from "@/features/editor/utils/constants";

import { 
  getWorkspace as getWorkspaceAction,
  addToCanvas as addToCanvasAction,
} from "@/features/editor/utils/editor-actions";

import { alignObjects } from "@/features/editor/utils/alignment";
import { 
  saveAsPng, 
  saveAsJpg, 
  saveAsSvg, 
  saveAsJson, 
  loadFromJson 
} from "@/features/editor/utils/export";

// Import new hooks
import { useEditorPages } from "@/features/editor/hooks/use-editor-pages";
import { useEditorShapes } from "@/features/editor/hooks/use-editor-shapes";
import { useEditorObjects } from "@/features/editor/hooks/use-editor-objects";
import { useEditorStyles } from "@/features/editor/hooks/use-editor-styles";
import { useEditorText } from "@/features/editor/hooks/use-editor-text";

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

  // Compose Sub-Hooks
  const {
    addPage,
    deletePage,
    nextPage,
    prevPage,
    goToPage,
    duplicatePage,
  } = useEditorPages({
    canvas,
    pages,
    setPages,
    currentPage,
    setCurrentPage,
    autoZoom,
    save,
  });

  const {
    addCircle,
    addSoftRectangle,
    addRectangle,
    addTriangle,
    addInverseTriangle,
    addDiamond,
    addPentagon,
    addHexagon,
    addOctagon,
    addStar,
    addArrow,
  } = useEditorShapes({
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    strokeDashArray,
  });

  const {
    groupObjects,
    ungroupObjects,
    lock,
    unlock,
    toggleLock,
    bringForward,
    sendBackwards,
  } = useEditorObjects({
    canvas,
    save,
  });

  const {
    changeFillColor,
    changeStrokeColor,
    changeStrokeWidth,
    changeStrokeDashArray,
    changeOpacity,
    getActiveFillColor,
    getActiveStrokeColor,
    getActiveStrokeWidth,
    getActiveStrokeDashArray,
    getActiveOpacity,
  } = useEditorStyles({
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
  });

  const {
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
    getActiveFontFamily,
  } = useEditorText({
    canvas,
    selectedObjects,
    fillColor,
    fontFamily,
    setFontFamily,
    save,
  });

  const getWorkspace = useCallback(() => getWorkspaceAction(canvas), [canvas]);

  const savePng = useCallback(() => {
    if (!canvas) return;
    saveAsPng(canvas, autoZoom);
  }, [canvas, autoZoom]);

  const saveSvg = useCallback(() => {
    if (!canvas) return;
    saveAsSvg(canvas, autoZoom);
  }, [canvas, autoZoom]);

  const saveJpg = useCallback(() => {
    if (!canvas) return;
    saveAsJpg(canvas, autoZoom);
  }, [canvas, autoZoom]);

  const saveJson = useCallback(async () => {
    if (!canvas) return;
    await saveAsJson(canvas);
  }, [canvas]);

  const loadJson = useCallback((json: string) => {
    if (!canvas) return;
    loadFromJson(canvas, json, autoZoom, save);
  }, [canvas, autoZoom, save]);

  const zoomIn = useCallback(() => {
    if (!canvas) return;
    let zoomRatio = canvas.getZoom();
    zoomRatio += ZOOM_CONFIG.STEP;
    const center = canvas.getVpCenter();
    const newZoom = zoomRatio > ZOOM_CONFIG.MAX ? ZOOM_CONFIG.MAX : zoomRatio;
    canvas.zoomToPoint(
      new fabric.Point(center.x, center.y),
      newZoom
    );
    setZoom(newZoom);
  }, [canvas]);

  const zoomOut = useCallback(() => {
    if (!canvas) return;
    let zoomRatio = canvas.getZoom();
    zoomRatio -= ZOOM_CONFIG.STEP;
    const center = canvas.getVpCenter();
    const newZoom = zoomRatio < ZOOM_CONFIG.MIN ? ZOOM_CONFIG.MIN : zoomRatio;
    canvas.zoomToPoint(
      new fabric.Point(center.x, center.y),
      newZoom,
    );
    setZoom(newZoom);
  }, [canvas]);

  const setZoomValue = useCallback((value: number) => {
    if (!canvas) return;
    const clampedZoom = Math.min(Math.max(value, ZOOM_CONFIG.MIN), ZOOM_CONFIG.MAX);
    const center = canvas.getVpCenter();
    canvas.zoomToPoint(
      new fabric.Point(center.x, center.y),
      clampedZoom
    );
    setZoom(clampedZoom);
  }, [canvas]);

  const zoomToSelected = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    const center = activeObject.getCenterPoint();
    canvas.zoomToPoint(
      new fabric.Point(center.x, center.y),
      1.5
    );
    setZoom(1.5);
  }, [canvas]);

  const changeSize = useCallback((value: { width: number; height: number }) => {
    const workspace = getWorkspace();
    workspace?.set(value);
    autoZoom();
    save();
  }, [getWorkspace, autoZoom, save]);

  const changeBackground = useCallback((value: string) => {
    const workspace = getWorkspace();
    workspace?.set({ fill: value });
    canvas?.renderAll();
    save();
  }, [getWorkspace, canvas, save]);

  const enableDrawingMode = useCallback(() => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = strokeWidth;
    canvas.freeDrawingBrush.color = strokeColor;
  }, [canvas, strokeWidth, strokeColor]);

  const disableDrawingMode = useCallback(() => {
    if (!canvas) return;
    canvas.isDrawingMode = false;
  }, [canvas]);

  const changeImageFilter = useCallback((value: string) => {
    if (!canvas) return;
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
  }, [canvas]);

  const addImage = useCallback((value: string) => {
    fabric.FabricImage.fromURL(
      value,
      {
        crossOrigin: value.startsWith("data:") || value.startsWith("blob:") ? undefined : "anonymous",
      },
    ).then((image) => {
      const workspace = getWorkspace();
      const workspaceWidth = workspace?.width || 800;
      const workspaceHeight = workspace?.height || 1000;
      
      if (image.width && image.height) {
        const scale = Math.min(
          workspaceWidth / image.width,
          workspaceHeight / image.height,
          1
        );
        image.scale(scale);
      }

      addToCanvasAction(image, canvas);
    });
  }, [canvas, getWorkspace]);

  const deleteObject = useCallback(() => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => canvas.remove(object));
    canvas.discardActiveObject();
    canvas.renderAll();
    save();
  }, [canvas, save]);

  const align = useCallback((position: "left" | "center" | "right" | "top" | "middle" | "bottom" | "distribute-horizontal" | "distribute-vertical") => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    const workspace = getWorkspace();

    if (!activeObject || !workspace) return;

    alignObjects(activeObject, workspace as fabric.Object, position);
    canvas.renderAll();
    save();
  }, [canvas, getWorkspace, save]);

  const clear = useCallback(() => {
      if (!canvas) return;
      canvas.getObjects().forEach((object) => {
        if ((object as any).name !== "clip") {
          canvas.remove(object);
        }
      });
      canvas.discardActiveObject();
      canvas.renderAll();
      save();
  }, [canvas, save]);

  const editor = useMemo(() => {
    if (canvas) {
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
        zoomIn,
        zoomOut,
        zoomToSelected,
        setZoom: setZoomValue,
        changeSize,
        changeBackground,
        enableDrawingMode,
        disableDrawingMode,
        onUndo: undo,
        onRedo: redo,
        onCopy: copy,
        onPaste: paste,
        copy,
        paste,
        changeImageFilter,
        addImage,
        delete: deleteObject,
        clear,
        addText,
        getActiveOpacity,
        changeFontSize,
        getActiveFontSize,
        changeTextAlign,
        getActiveTextAlign,
        changeFontUnderline,
        getActiveFontUnderline,
        changeFontLinethrough,
        getActiveFontLinethrough,
        changeFontStyle,
        getActiveFontStyle,
        changeFontWeight,
        changeOpacity,
        bringForward,
        sendBackwards,
        changeFontFamily,
        changeFillColor,
        changeStrokeColor,
        changeStrokeWidth,
        changeStrokeDashArray,
        addCircle,
        addSoftRectangle,
        addRectangle,
        addTriangle,
        addInverseTriangle,
        addDiamond,
        canvas,
        getActiveFontWeight,
        getActiveFontFamily,
        getActiveFillColor,
        getActiveStrokeColor,
        getActiveStrokeWidth,
        getActiveStrokeDashArray,
        selectedObjects,
        groupObjects,
        ungroupObjects,
        lock,
        unlock,
        align,
        addPage,
        deletePage,
        nextPage,
        prevPage,
        goToPage,
        duplicatePage,
        toggleLock,
        addPentagon,
        addHexagon,
        addOctagon,
        addStar,
        addArrow,
        onSave: (skip = false) => save(skip, false),
        zoom,
        currentPage,
        totalPages: Math.max(pages.length, 1),
      } as Editor;
    }

    return undefined;
  }, 
  [
    canvas,
    savePng,
    saveJpg,
    saveSvg,
    saveJson,
    loadJson,
    canUndo,
    canRedo,
    autoZoom,
    getWorkspace,
    zoomIn,
    zoomOut,
    zoomToSelected,
    setZoomValue,
    changeSize,
    changeBackground,
    enableDrawingMode,
    disableDrawingMode,
    undo,
    redo,
    copy,
    paste,
    changeImageFilter,
    addImage,
    deleteObject,
    clear,
    addText,
    getActiveOpacity,
    changeFontSize,
    getActiveFontSize,
    changeTextAlign,
    getActiveTextAlign,
    changeFontUnderline,
    getActiveFontUnderline,
    changeFontLinethrough,
    getActiveFontLinethrough,
    changeFontStyle,
    getActiveFontStyle,
    changeFontWeight,
    changeOpacity,
    bringForward,
    sendBackwards,
    changeFontFamily,
    changeFillColor,
    changeStrokeColor,
    changeStrokeWidth,
    changeStrokeDashArray,
    addCircle,
    addSoftRectangle,
    addRectangle,
    addTriangle,
    addInverseTriangle,
    addDiamond,
    getActiveFontWeight,
    getActiveFontFamily,
    getActiveFillColor,
    getActiveStrokeColor,
    getActiveStrokeWidth,
    getActiveStrokeDashArray,
    selectedObjects,
    groupObjects,
    ungroupObjects,
    lock,
    unlock,
    align,
    addPage,
    deletePage,
    nextPage,
    prevPage,
    goToPage,
    toggleLock,
    addPentagon,
    addHexagon,
    addOctagon,
    addStar,
    addArrow,
    save,
    zoom,
    currentPage,
    pages.length,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set(EDITOR_CONTROLS);

      const initialWorkspace = new fabric.Rect({
        width: initialWidth.current,
        height: initialHeight.current,
        fill: WORKSPACE_DEFAULTS.fill,
        name: WORKSPACE_DEFAULTS.name,
        selectable: WORKSPACE_DEFAULTS.selectable,
        hasControls: WORKSPACE_DEFAULTS.hasControls,
        shadow: new fabric.Shadow({
          color: WORKSPACE_DEFAULTS.shadowColor,
          blur: WORKSPACE_DEFAULTS.shadowBlur,
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
      canvasHistoryRef,
      setHistoryIndex,
    ]
  );

  return { init, editor };
};
