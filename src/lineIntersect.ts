// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments

import { Line, Point, Ray } from "./types";

const dotProduct = (a: Point, b: Point) => (a.x * b.x) + (a.y * b.y);

const subtractVector = (p1: Point, p2: Point): Point => ({
  x: p1.x - p2.x,
  y: p1.y - p2.y,
});

const rotateVector90 = (vector: Point): Point => ({
  x: -vector.y,
  y: vector.x,
});
// based on code from '2D Game Collision Detection' by Thomas Schwarzl
// "If there exists a line that separates two shapes, they cannot intersect"
export const onOneSide = (ray: Ray, line: Line): boolean => {
  const d1 = subtractVector(line.a, ray.start);
  const d2 = subtractVector(line.b, ray.start);
  const n = rotateVector90(ray.direction);
  return dotProduct(n, d1) * dotProduct(n, d2) > 0;
};

// based on https://stackoverflow.com/questions/41687083/formula-to-determine-if-an-infinite-line-and-a-line-segment-intersect

//returns the difference vector between two points (pointB - pointA)
function delta(a: Point, b: Point): Point {
  return { x: b.x - a.x, y: b.y - a.y };
}
// 2D-version cross-product
function cp(a: Point, b: Point): number {
  return a.y * b.x - a.x * b.y;
}

/**
 * Get intersection point of ray on a line
 * @param line Line segment (two points)
 * @param ray Ray (point with a direction)
 * @returns false if ray does not intersect line, otherwise returns Point
 */
export function lineRayIntersection(line: Line, ray: Ray): Point | false {
  const lineDelta = delta(line.a, line.b);
  const pointToLineDelta = delta(ray.start, line.a);
  const crossProduct = cp(ray.direction, lineDelta);

  // ray and line are paralell, no intersection possible
  if (!crossProduct) return false;

  const u = cp(pointToLineDelta, lineDelta) / crossProduct;
  const v = cp(pointToLineDelta, ray.direction) / crossProduct;

  if (!(v >= 0 && v <= 1)) {
    return false;
  }

  return { x: line.a.x + lineDelta.x * v, y: line.a.y + lineDelta.y * v };
}
