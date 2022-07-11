import { Line, Point } from "./types";
import * as PIXI from "pixi.js";

export const VIEW_W = 800;
export const VIEW_H = 600;

const app = new PIXI.Application({
  width: VIEW_W,
  height: VIEW_H,
  backgroundColor: 0x000000,
  resolution: 1,
  view: document.getElementById("pixi") as HTMLCanvasElement,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

document.body.appendChild(app.view);

export const mainContainer = new PIXI.Container();
mainContainer.hitArea = new PIXI.Rectangle(0, 0, VIEW_W, VIEW_H);

app.stage.addChild(mainContainer);

export const drawPoint = (
  gfx: PIXI.Graphics,
  clear = true,
  fill = 0x285cc4,
  line = 0x143464
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
export const pointTexture = app.renderer.generateTexture(pointGfx);

export const updateShape = (
  graphics: PIXI.Graphics,
  points: Point[],
  fill = 0x143464
) => {
  graphics.clear();
  graphics.beginFill(fill, 0.3);
  graphics.lineStyle(4, 0x249fde, 0.8);
  graphics.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    graphics.lineTo(point.x, point.y);
  });
  graphics.closePath();
  graphics.endFill();
};

export const linesGfx = new PIXI.Graphics();

export const drawLines = (lines: Line[]) => {
  linesGfx.clear();
  linesGfx.lineStyle(4, 0x59c135, 0.8);
  lines.forEach((line) => {
    linesGfx.moveTo(line.a.x, line.a.y);
    linesGfx.lineTo(line.b.x, line.b.y);
  });
};

export const addToMainContainer = (children: PIXI.Container[]) => {
    children.forEach((c) => {
        mainContainer.addChild(c);
    })
}

export const setupRenderLoop = (renderCallback: () => void) => {
  app.ticker.add((delta) => {
    renderCallback();
  });
};
