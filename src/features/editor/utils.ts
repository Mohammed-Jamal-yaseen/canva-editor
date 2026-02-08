import * as fabric from "fabric";
import { RGBColor } from "react-color";
import { v4 as uuidv4 } from "uuid";

export function isTextType(type?: string) {
  return (
    type === "text" || 
    type === "i-text" || 
    type === "textbox"
  );
}

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement("a");

  anchorElement.href = file;
  anchorElement.download = `${uuidv4()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

export function transformText(objects: fabric.Object[]) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if ((item as any).objects) {
      transformText((item as any).objects);
    }
    if (item.type === "text" || item.type === "i-text" || item.type === "textbox") {
      item.set({ fill: item.fill || "black" });
    }
  });
}

export function rgbaObjectToString(rgba: RGBColor | string) {
  if (typeof rgba === "string") return rgba;

  const alpha = rgba.a === undefined ? 1 : rgba.a;
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

