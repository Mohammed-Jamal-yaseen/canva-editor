import * as fabric from "fabric";
import { useEffect, useRef } from "react";

import { JSON_KEYS } from "@/features/editor/types";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistoryRef: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const useLoadState = ({
  canvas,
  autoZoom,
  initialState,
  canvasHistoryRef,
  setHistoryIndex,
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState?.current && canvas) {
      const data = JSON.parse(initialState.current);

      canvas.loadFromJSON(data).then(() => {
        const currentState = JSON.stringify(
          // @ts-expect-error - Fabric 7 type mismatch
          canvas.toJSON(JSON_KEYS),
        );

        canvasHistoryRef.current = [currentState];
        setHistoryIndex(0);
        autoZoom();
        canvas.renderAll();
      });
      initialized.current = true;
    }
  }, 
  [
    canvas,
    autoZoom,
    initialState, // no need, this is a ref
    canvasHistoryRef, // no need, this is a ref
    setHistoryIndex, // no need, this is a dispatch
  ]);
};
