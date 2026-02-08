
import * as fabric from "fabric";
import { useCallback } from "react";
import { 
  CIRCLE_OPTIONS, 
  RECTANGLE_OPTIONS, 
  TRIANGLE_OPTIONS, 
  DIAMOND_OPTIONS 
} from "@/features/editor/types";
import { 
  getPolygonPoints, 
  getStarPoints, 
  ARROW_POINTS, 
  getDiamondPoints, 
  getInverseTrianglePoints 
} from "@/features/editor/utils/shapes";
import { addToCanvas } from "@/features/editor/utils/editor-actions";

interface UseEditorShapesProps {
  canvas: fabric.Canvas | null;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
}

export const useEditorShapes = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDashArray,
}: UseEditorShapesProps) => {

  const addCircle = useCallback(() => {
    const object = new fabric.Circle({
      ...CIRCLE_OPTIONS,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addSoftRectangle = useCallback(() => {
    const object = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      rx: 50,
      ry: 50,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addRectangle = useCallback(() => {
    const object = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addTriangle = useCallback(() => {
    const object = new fabric.Triangle({
      ...TRIANGLE_OPTIONS,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addInverseTriangle = useCallback(() => {
    const HEIGHT = TRIANGLE_OPTIONS.height;
    const WIDTH = TRIANGLE_OPTIONS.width;
    const points = getInverseTrianglePoints(WIDTH, HEIGHT);
    
    const object = new fabric.Polygon(points, {
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      }
    );
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addDiamond = useCallback(() => {
    const HEIGHT = DIAMOND_OPTIONS.height;
    const WIDTH = DIAMOND_OPTIONS.width;
    const points = getDiamondPoints(WIDTH, HEIGHT);

    const object = new fabric.Polygon(points, {
        ...DIAMOND_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      }
    );
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addPentagon = useCallback(() => {
    const points = getPolygonPoints(5);
    const object = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addHexagon = useCallback(() => {
    const points = getPolygonPoints(6);
    const object = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addOctagon = useCallback(() => {
    const points = getPolygonPoints(8);
    const object = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addStar = useCallback(() => {
    const points = getStarPoints(5, 50, 25);
    const object = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  const addArrow = useCallback(() => {
    const points = ARROW_POINTS;
    const object = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    addToCanvas(object, canvas);
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

  return {
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
  };
};
