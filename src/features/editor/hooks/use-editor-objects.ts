
import * as fabric from "fabric";
import { useCallback } from "react";
import { getWorkspace } from "@/features/editor/utils/editor-actions";

interface UseEditorObjectsProps {
  canvas: fabric.Canvas | null;
  save: () => void;
}

export const useEditorObjects = ({
  canvas,
  save,
}: UseEditorObjectsProps) => {

  const groupObjects = useCallback(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== "activeSelection") return;

    const group = (activeObject as any).toGroup();
    canvas.setActiveObject(group);
    
    const selectedObject = canvas.getActiveObjects();
    // @ts-ignore
    canvas.fire("selection:updated", { selected: selectedObject });
    
    canvas.renderAll();
    save();
  }, [canvas, save]);

  const ungroupObjects = useCallback(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== "group") return;

    const activeSelection = (activeObject as any).toActiveSelection();
    canvas.setActiveObject(activeSelection);
    
    const selectedObject = canvas.getActiveObjects();
    // @ts-ignore
    canvas.fire("selection:updated", { selected: selectedObject });

    canvas.renderAll();
    save();
  }, [canvas, save]);

  const lock = useCallback(() => {
    if (!canvas) return;
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
  }, [canvas, save]);

  const unlock = useCallback(() => {
    if (!canvas) return;
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
  }, [canvas, save]);

  const toggleLock = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    // @ts-ignore
    const isLocked = activeObject.get("locked");
    
    if (isLocked) {
      unlock();
    } else {
      lock();
    }
  }, [canvas, lock, unlock]);

  const bringForward = useCallback(() => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => {
      canvas.bringObjectForward(object);
    });

    canvas.renderAll();
    
    const workspace = getWorkspace(canvas);
    if (workspace) {
      canvas.sendObjectToBack(workspace);
    }
    save();
  }, [canvas, save]);

  const sendBackwards = useCallback(() => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => {
      canvas.sendObjectBackwards(object);
    });

    canvas.renderAll();
    const workspace = getWorkspace(canvas);
    if (workspace) {
      canvas.sendObjectToBack(workspace);
    }
    save();
  }, [canvas, save]);

  return {
    groupObjects,
    ungroupObjects,
    lock,
    unlock,
    toggleLock,
    bringForward,
    sendBackwards,
  };
};
