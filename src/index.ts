import Stats from "stats.js";
import { addDraggablePoints } from "./draggable";
import { addToMainContainer, linesGfx, setupRenderLoop, updateShape } from "./render_utils";
import { debugPane, rectangle, rectangleGfx, rectanglePoints, triangle, updateDerivedValues } from "./debug_utils";
import * as PIXI from 'pixi.js';

const triangleGraphics = new PIXI.Graphics();

addToMainContainer([linesGfx, triangleGraphics]);

addDraggablePoints(triangle);
updateDerivedValues();

const stats = new Stats();
stats.showPanel(0);
stats.dom.style.position = 'relative';
document.getElementById("stats")?.appendChild(stats.dom);

setupRenderLoop(() => {
    stats.begin();
    debugPane.refresh();
    updateShape(triangleGraphics, [...Object.values(triangle)]);
    updateShape(rectangleGfx, rectanglePoints);
    stats.end();
})


export {};
