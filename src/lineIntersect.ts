// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments

import { Line, Point } from "./types";

// Return FALSE if the lines don't intersect
export function intersect(line1: Line, line2: Line) {
  // Check if none of the lines are of length 0
  if (
    (line1.a.x === line1.b.x && line1.a.y === line1.b.y) ||
    (line2.a.x === line2.b.x && line2.a.y === line2.b.y)
  ) {
    return false;
  }

  const denominator =
    (line2.b.y - line2.a.y) * (line1.b.x - line1.a.x) -
    (line2.b.x - line2.a.x) * (line1.b.y - line1.a.y);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua =
    ((line2.b.x - line2.a.x) * (line1.a.y - line2.a.y) -
      (line2.b.y - line2.a.y) * (line1.a.x - line2.a.x)) /
    denominator;
  let ub =
    ((line1.b.x - line1.a.x) * (line1.a.y - line2.a.y) -
      (line1.b.y - line1.a.y) * (line1.a.x - line2.a.x)) /
    denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = line1.a.x + ua * (line1.b.x - line1.a.x);
  let y = line1.a.y + ua * (line1.b.y - line1.a.y);

  return { x, y };
}

// based on https://stackoverflow.com/questions/41687083/formula-to-determine-if-an-infinite-line-and-a-line-segment-intersect

//returns the difference vector between two points (pointB - pointA)
function delta(a: Point, b: Point): Point {
  return { x: b.x - a.x, y: b.y - a.y };
}
//kind of a 2D-version of the cross-product
function cp(a: Point, b: Point): number {
  return a.y * b.x - a.x * b.y;
}

export function intersection(
  line: Line,
  point: Point,
  vector: Point
): Point | false {
  const lineDelta = delta(line.a, line.b);
  const pointToLineDelta = delta(point, line.a);
  const crossProduct = cp(vector, lineDelta);

  //rays are paralell, no intersection possible
  if (!crossProduct) return false;

  const u = cp(pointToLineDelta, lineDelta) / crossProduct;
  const v = cp(pointToLineDelta, vector) / crossProduct;

  if (!(v >= 0 && v <= 1)) {
    return false;
  }


  return { x: line.a.x + lineDelta.x * v, y: line.a.y + lineDelta.y * v };
}
