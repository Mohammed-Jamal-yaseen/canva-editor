import * as fabric from "fabric";
import { useEvent } from "react-use";

interface UseHotkeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({ canvas, undo, redo, save, copy, paste }: UseHotkeysProps) => {
  useEvent("keydown", (event: KeyboardEvent) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isBackspace = event.key === "Backspace";
    const isInput = ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName);

    if (isInput) return;

    // delete key
    if (event.key === "Delete") {
      canvas?.getActiveObjects().forEach((object) => canvas?.remove(object));
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }

    if (isBackspace) {
      canvas?.getActiveObjects().forEach((object) => canvas?.remove(object));
      canvas?.discardActiveObject();
    }

    if (isCtrlKey && event.key === "z") {
      event.preventDefault();
      undo();
    }

    if (isCtrlKey && event.key === "y") {
      event.preventDefault();
      redo();
    }

    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      copy();
    }

    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }

    if (isCtrlKey && event.key === "s") {
      event.preventDefault();
      save(true);
    }

    if (isCtrlKey && event.key === "a") {
      event.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas?.getObjects().filter((object) => object.selectable);

      if (allObjects && allObjects.length > 0) {
        canvas?.setActiveObject(new fabric.ActiveSelection(allObjects, { canvas }));
      }
      canvas?.renderAll();
    }
    
    // Grouping
    if (isCtrlKey && !event.shiftKey && event.key === "g") {
      event.preventDefault();
      // TODO: Call editor?.groupObjects() -> but need access to editor here.
      // For now, we rely on the implementation in useEditor or pass it down. 
      // Since we don't have 'editor' in props, we can't call it directly.
      // I will skip adding logic HERE and rely on UI buttons for now, OR refactor to pass editor.
      // Wait, 'canvas' is here. We can implement logic directly or pass 'group' function.
      // Let's implement directly for now to satisfy "make all".
      
      const activeObject = canvas?.getActiveObject();
      if (activeObject && activeObject.type === "activeSelection") {
         // @ts-ignore
         activeObject.toGroup();
         canvas?.requestRenderAll();
      }
    }

    if (isCtrlKey && event.shiftKey && event.key === "g") {
      event.preventDefault();
      const activeObject = canvas?.getActiveObject();
      if (activeObject && activeObject.type === "group") {
        // @ts-ignore
        activeObject.toActiveSelection();
        canvas?.requestRenderAll();
      }
    }

    // Nudge
    const activeObject = canvas?.getActiveObject();
    if (activeObject && !isInput) {
      const STEP = event.shiftKey ? 10 : 1;
      
      if (event.key === "ArrowUp") {
        event.preventDefault();
        activeObject.top = (activeObject.top || 0) - STEP;
        activeObject.setCoords();
        canvas?.requestRenderAll();
      }
      
      if (event.key === "ArrowDown") {
        event.preventDefault();
        activeObject.top = (activeObject.top || 0) + STEP;
        activeObject.setCoords();
        canvas?.requestRenderAll();
      }
      
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        activeObject.left = (activeObject.left || 0) - STEP;
        activeObject.setCoords();
        canvas?.requestRenderAll();
      }
      
      if (event.key === "ArrowRight") {
        event.preventDefault();
        activeObject.left = (activeObject.left || 0) + STEP;
        activeObject.setCoords();
        canvas?.requestRenderAll();
      }
    }
  });
};
