import { Pane } from "tweakpane";
import {
  VIEW_W,
  VIEW_H,
  drawPoint,
  mainContainer,
  drawLines,
  addToMainContainer,
} from "./render_utils";
import {
  getTriangleCentroid,
  getRectangleInsideTriangle,
  getCandidateLinesFromTrianglePoints,
  getRightAngleIntersections,
  getLinesOfTriangle,
} from "./triangle";
import * as PIXI from "pixi.js";
import { triangle } from "./shapes";

export let rectanglePoints: any[] = [];

export const debugPane = new Pane({
  title: "Triangle",
  container: document.getElementById("debug")!,
});

const triangleDerivedValues = {
  centroid: { x: 5, y: 5 },
  rectangle: "",
};

const debugSettings = {
  x: { step: 1, min: 0, max: VIEW_W },
  y: { step: 1, min: 0, max: VIEW_H },
  picker: "inline",
};
debugPane.addInput(triangle, "a", debugSettings);
debugPane.addInput(triangle, "b", debugSettings);
debugPane.addInput(triangle, "c", debugSettings);
debugPane.addInput(triangleDerivedValues, "centroid", { disabled: true });
debugPane.addMonitor(triangleDerivedValues, "rectangle", {
  disabled: false,
  multiline: true,
  lineCount: 30,
});
debugPane.exportPreset();
export const updatePointHandlers: (() => void)[] = [];

debugPane.on("change", () => {
  updatePointHandlers.forEach((h) => {
    h();
  });
  updateDerivedValues();
});

const centroidPoint = new PIXI.Graphics();
drawPoint(centroidPoint);

export const rectangleGfx = new PIXI.Graphics();
mainContainer.addChild(rectangleGfx);

export const updateDerivedValues = () => {
  const triangleCentroid = getTriangleCentroid(triangle);
  triangleDerivedValues.centroid = triangleCentroid;
  centroidPoint.x = triangleCentroid.x;
  centroidPoint.y = triangleCentroid.y;
  drawPoint(centroidPoint);

  const points = getRectangleInsideTriangle(triangle);

  const markedRectanglePoints = getCandidateLinesFromTrianglePoints(points);
  const rightAngleLines = getRightAngleIntersections(
    markedRectanglePoints,
    getLinesOfTriangle(triangle)
  );

  rectanglePoints = Object.values(markedRectanglePoints);

  triangleDerivedValues.rectangle = JSON.stringify(
    { count: rightAngleLines.length, rightAngleLines },
    null,
    2
  );
  drawLines(rightAngleLines);
};

addToMainContainer([centroidPoint])