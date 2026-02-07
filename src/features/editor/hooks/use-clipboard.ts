import * as fabric from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
};

export const useClipboard = ({
  canvas
}: UseClipboardProps) => {
  const clipboard = useRef<fabric.Object | null>(null);

  const copy = useCallback(() => {
    canvas?.getActiveObject()?.clone().then((cloned) => {
      clipboard.current = cloned;
    });
  }, [canvas]);
  
  const paste = useCallback(() => {
    if (!clipboard.current) return;

    clipboard.current.clone().then((clonedObj) => {
      canvas?.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });

      if (clonedObj.type === "activeSelection") {
        // @ts-expect-error - Fabric 7 type mismatch
        clonedObj.canvas = canvas;
        // @ts-expect-error - Fabric 7 type mismatch
        clonedObj.forEachObject((obj: fabric.Object) => {
          canvas?.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas?.add(clonedObj);
      }

      if (clipboard.current) {
        clipboard.current.top += 10;
        clipboard.current.left += 10;
      }
      canvas?.setActiveObject(clonedObj);
      canvas?.requestRenderAll();
    });
  }, [canvas]);

  return { copy, paste };
};
