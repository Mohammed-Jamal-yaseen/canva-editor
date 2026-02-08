
import * as fabric from "fabric";

export const createShape = (
  Factory: any, 
  options: any, 
  fillColor: string, 
  strokeColor: string, 
  strokeWidth: number,
  strokeDashArray: number[]
) => {
  return new Factory({
    ...options,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    strokeDashArray: strokeDashArray,
  });
};

export const getPolygonPoints = (sides: number, radius: number = 50) => {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push({
      x: radius + radius * Math.cos(angle),
      y: radius + radius * Math.sin(angle),
    });
  }
  return points;
};

export const getStarPoints = (spikes: number = 5, outerRadius: number = 50, innerRadius: number = 25) => {
  const points = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    points.push({
      x: outerRadius + radius * Math.cos(angle),
      y: outerRadius + radius * Math.sin(angle),
    });
  }
  return points;
};


export const ARROW_POINTS = [
  { x: 0, y: 20 },
  { x: 60, y: 20 },
  { x: 60, y: 0 },
  { x: 100, y: 30 },
  { x: 60, y: 60 },
  { x: 60, y: 40 },
  { x: 0, y: 40 },
];

export const getDiamondPoints = (width: number, height: number) => {
  return [
    { x: width / 2, y: 0 },
    { x: width, y: height / 2 },
    { x: width / 2, y: height },
    { x: 0, y: height / 2 },
  ];
};

export const getInverseTrianglePoints = (width: number, height: number) => {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width / 2, y: height },
  ];
};
