
import * as fabric from "fabric";
import { downloadFile, transformText } from "@/features/editor/utils";
import { JSON_KEYS } from "@/features/editor/types";
import { SAVE_OPTIONS } from "@/features/editor/utils/constants";

export const generateSaveOptions = (canvas: fabric.Canvas) => {
  const workspace = canvas
    .getObjects()
    .find((object) => (object as any).name === "clip") as fabric.Rect;

  const { width = 0, height = 0, left = 0, top = 0 } = workspace || {};

  return {
    name: SAVE_OPTIONS.name,
    format: SAVE_OPTIONS.format as "png" | "jpeg" | "svg",
    quality: SAVE_OPTIONS.quality,
    width,
    height,
    left,
    top,
  };
};

export const saveAsPng = (canvas: fabric.Canvas, autoZoom: () => void) => {
  const options = generateSaveOptions(canvas);

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  // @ts-expect-error - Fabric 7 type mismatch
  const dataUrl = canvas.toDataURL(options);

  downloadFile(dataUrl, "png");
  autoZoom();
};

export const saveAsSvg = (canvas: fabric.Canvas, autoZoom: () => void) => {
  const options = generateSaveOptions(canvas);

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  // @ts-expect-error - Fabric 7 type mismatch
  const dataUrl = canvas.toDataURL(options);

  downloadFile(dataUrl, "svg");
  autoZoom();
};

export const saveAsJpg = (canvas: fabric.Canvas, autoZoom: () => void) => {
  const options = generateSaveOptions(canvas);

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  // @ts-expect-error - Fabric 7 type mismatch
  const dataUrl = canvas.toDataURL(options);

  downloadFile(dataUrl, "jpg");
  autoZoom();
};

export const saveAsJson = async (canvas: fabric.Canvas) => {
  // @ts-expect-error - Fabric 7 type mismatch
  const dataUrl = canvas.toJSON(JSON_KEYS);

  await transformText(dataUrl.objects);
  const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(dataUrl, null, "\t")
  )}`;
  downloadFile(fileString, "json");
};

export const loadFromJson = (canvas: fabric.Canvas, json: string, autoZoom: () => void, save: () => void) => {
  const data = JSON.parse(json);

  canvas.loadFromJSON(data).then(() => {
    autoZoom();
    canvas.renderAll();
    save();
  });
};
