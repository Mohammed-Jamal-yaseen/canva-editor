import * as fabric from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(async () => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setDimensions({ width, height });

    const center = canvas.getVpCenter();

    const zoomRatio = 1;
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.type === "clip");

    if (!localWorkspace) return;

    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width: width,
      height: height,
    });

    const zoom = zoomRatio * scale;

    // @ts-expect-error - Fabric 7 type mismatch
    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.x, center.y), zoom);

    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = [...canvas.viewportTransform];

    if (
      canvas.width === undefined ||
      canvas.height === undefined
    ) {
      return;
    }

    viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];

    viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    // @ts-expect-error - Fabric 7 type mismatch
    canvas.setViewportTransform(viewportTransform);

    localWorkspace.clone().then((cloned) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};
