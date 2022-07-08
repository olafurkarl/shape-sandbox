import * as PIXI from "pixi.js";
import { Pane } from "tweakpane";
import { getRectangleInsideTriangle, getTriangleCentroid } from "./triangle";
import { Point } from "./types";

const VIEW_W = 800;
const VIEW_H = 600;

const app = new PIXI.Application({
  width: VIEW_W,
  height: VIEW_H,
  backgroundColor: 0x000000,
  resolution: 1,
  view: document.getElementById("pixi") as HTMLCanvasElement,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

document.body.appendChild(app.view);

const mainContainer = new PIXI.Container();
mainContainer.hitArea = new PIXI.Rectangle(0, 0, VIEW_W, VIEW_H);

app.ticker.speed = 0.5;

app.stage.addChild(mainContainer);

const triangle = {
  a: { x: 380, y: 180 },
  b: { x: 220, y: 50 },
  c: { x: 100, y: 180 },
};

const debugPane = new Pane({
  title: "Triangle",
  container: document.getElementById("debug")!,
});

const triangleDerivedValues: { centroid: Point | undefined } = {
  centroid: { x: 5, y: 5 },
};

const debugSettings = {
  x: { step: 1, min: 0, max: VIEW_W },
  y: { step: 1, min: 0, max: VIEW_H },
  picker: 'inline'
};
debugPane.addInput(triangle, "a", debugSettings);
debugPane.addInput(triangle, "b", debugSettings);
debugPane.addInput(triangle, "c", debugSettings);
debugPane.addInput(triangleDerivedValues, "centroid", { disabled: true });
const updatePointHandlers: (() => void)[] = [];
debugPane.on("change", () => {
    updatePointHandlers.forEach((h) => {
        h();
    })
    updateDerivedValues();
});

const drawPoint = (
  gfx: PIXI.Graphics,
  clear = true,
  fill = 0x285cc4,
  line = 0x143464,
): void => {
    if (clear) {
        gfx.clear();

    }
  gfx.lineStyle(1, line, 1);
  gfx.beginFill(fill);
  gfx.drawCircle(0, 0, 3);
  gfx.endFill();
};

const pointGfx = new PIXI.Graphics();
drawPoint(pointGfx);
const pointTexture = app.renderer.generateTexture(pointGfx);

const centroidPoint = new PIXI.Graphics();
drawPoint(centroidPoint);
mainContainer.addChild(centroidPoint);

const collisionPoints = [
    new PIXI.Graphics(),
    new PIXI.Graphics(),
    new PIXI.Graphics(),
    new PIXI.Graphics(),
    new PIXI.Graphics(),
    new PIXI.Graphics(),
    new PIXI.Graphics(),
    new PIXI.Graphics(),
]


const updateDerivedValues = () => {
  const triangleCentroid = getTriangleCentroid(triangle);
  triangleDerivedValues.centroid = triangleCentroid;
  centroidPoint.x = triangleCentroid.x;
  centroidPoint.y = triangleCentroid.y;
  drawPoint(centroidPoint);

  const points = getRectangleInsideTriangle(triangle);
  collisionPoints.forEach((p) => p.clear);
  console.log(points);
  collisionPoints.forEach((p, i) => {
    if (points[i]) {
        p.x = points[i].x;
        p.y = points[i].y;
        drawPoint(p, false, 0xff00ff);
    }
  })
};

const addDraggablePoints = (points: Record<string, Point>) => {
  for (const key in points) {
    const pointGraphics = new PIXI.Sprite(pointTexture);
    pointGraphics.name = key;
    mainContainer.addChild(pointGraphics);
    pointGraphics.interactive = true;
    pointGraphics.buttonMode = true;

    pointGraphics.anchor.set(0.5);
    pointGraphics.scale.set(3);
    const updatePoint = () => {
      pointGraphics.x = points[key].x;
      pointGraphics.y = points[key].y;
    };
    updatePointHandlers.push(updatePoint);
    updatePoint();
    const onDragMove = (event: PIXI.InteractionEvent) => {
      if ((pointGraphics as any).dragging) {
        const newPosition = (pointGraphics as any).data.getLocalPosition(
          pointGraphics.parent
        );
        pointGraphics.x = newPosition.x;
        pointGraphics.y = newPosition.y;
        points[key].x = newPosition.x;
        points[key].y = newPosition.y;

        updateDerivedValues();
      }
    };

    const onDragEnd = (event: PIXI.InteractionEvent) => {
      pointGraphics.alpha = 1;
      (pointGraphics as any).dragging = false;
      (pointGraphics as any).data = null;
    };

    const onDragStart = (event: PIXI.InteractionEvent) => {
      (pointGraphics as any).data = event.data;
      pointGraphics.alpha = 0.5;
      (pointGraphics as any).dragging = true;
    };

    pointGraphics
      .on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd)
      .on("pointerupoutside", onDragEnd)
      .on("pointermove", onDragMove);
  }
};

const updateShape = (graphics: PIXI.Graphics, points: Point[]) => {
  graphics.clear();
  graphics.beginFill(0x143464, 0.3);
  graphics.lineStyle(4, 0x249fde, 0.8);
  graphics.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    graphics.lineTo(point.x, point.y);
  });
  graphics.closePath();
  graphics.endFill();
};

const triangleGraphics = new PIXI.Graphics();
mainContainer.addChild(triangleGraphics);
collisionPoints.forEach((p) => {
    mainContainer.addChild(p);
})

addDraggablePoints(triangle);
updateDerivedValues();
app.ticker.add((delta) => {
  debugPane.refresh();
  updateShape(triangleGraphics, [...Object.values(triangle)]);
});

export {};
