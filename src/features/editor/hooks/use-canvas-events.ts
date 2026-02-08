import * as fabric from "fabric";
import { useEffect } from "react";
import { ActiveTool } from "@/features/editor/types";

interface UseCanvasEventsProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  activeTool: ActiveTool;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
};

export const useCanvasEvents = ({
  save,
  canvas,
  activeTool,
  setSelectedObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("selection:created", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });

      canvas.on("mouse:wheel", (opt) => {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        
        // Limit zoom to points within reasonable bounds
        canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      canvas.on("mouse:down", (opt) => {
        const evt = opt.e as any;
        if (evt.altKey === true || evt.button === 1 || activeTool === "hand") {
          (canvas as any).isDragging = true;
          canvas.selection = false;
          (canvas as any).lastPosX = evt.clientX;
          (canvas as any).lastPosY = evt.clientY;
          canvas.defaultCursor = "grabbing";
          canvas.setCursor("grabbing");
        }
      });

      canvas.on("mouse:move", (opt) => {
        if ((canvas as any).isDragging) {
          const e = opt.e as any;
          const vpt = canvas.viewportTransform;
          
          let newX = vpt[4] + (e.clientX - (canvas as any).lastPosX);
          let newY = vpt[5] + (e.clientY - (canvas as any).lastPosY);

          // Hard constraints to prevent disappearing into void
          const limit = 5000;
          if (newX > limit) newX = limit;
          if (newX < -limit) newX = -limit;
          if (newY > limit) newY = limit;
          if (newY < -limit) newY = -limit;

          vpt[4] = newX;
          vpt[5] = newY;

          canvas.requestRenderAll();
          (canvas as any).lastPosX = e.clientX;
          (canvas as any).lastPosY = e.clientY;
          canvas.setCursor("grabbing");
        }
      });

      canvas.on("mouse:up", () => {
        canvas.setViewportTransform(canvas.viewportTransform);
        (canvas as any).isDragging = false;
        canvas.selection = true;
        canvas.defaultCursor = activeTool === "hand" ? "grab" : "default";
        canvas.setCursor(activeTool === "hand" ? "grab" : "default");
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("mouse:wheel");
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");
      }
    };
  },
  [
    save,
    canvas,
    activeTool,
    clearSelectionCallback,
    setSelectedObjects
  ]);
};
