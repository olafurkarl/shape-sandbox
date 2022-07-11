import * as PIXI from "pixi.js";
import { updatePointHandlers, updateDerivedValues } from "./debug_utils";
import { pointTexture, addToMainContainer } from "./render_utils";
import { Point } from "./types";

export const addDraggablePoints = (
  points: Record<string, Point>
) => {
  const pointsGfx: PIXI.Container[] = [];
  for (const key in points) {
    const pointGraphics = new PIXI.Sprite(pointTexture);
    pointGraphics.name = key;
    pointsGfx.push(pointGraphics);
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

  addToMainContainer(pointsGfx);
};
