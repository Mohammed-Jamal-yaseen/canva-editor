
import * as fabric from "fabric";

export const getWorkspace = (canvas: fabric.Canvas | null) => {
  if (!canvas) return undefined;
  
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

export const center = (object: fabric.Object, canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  const workspace = getWorkspace(canvas);
  const center = workspace?.getCenterPoint();

  if (!center) return;

  canvas._centerObject(object, center);
};

export const addToCanvas = (object: fabric.Object, canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  
  center(object, canvas);
  canvas.add(object);
  canvas.setActiveObject(object);
};

export const modifyActiveObjects = (
  canvas: fabric.Canvas | null,
  callback: (object: fabric.Object) => void
) => {
  if (!canvas) return;
  
  canvas.getActiveObjects().forEach(callback);
  canvas.renderAll();
};

export const getActiveProperty = <T>(
  selectedObjects: fabric.Object[],
  property: string,
  defaultValue: T
): T => {
    const selectedObject = selectedObjects[0];
    if (!selectedObject) return defaultValue;
    return (selectedObject.get(property) as T) || defaultValue;
};
