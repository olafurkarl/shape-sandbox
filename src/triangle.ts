import { intersection } from "./lineIntersect";
import { Line, Point, Quad, Triangle } from "./types";

// The centroid of a triangle = ((x1+x2+x3)/3, (y1+y2+y3)/3)
export const getTriangleCentroid = (triangle: Triangle): Point => {
  return {
    x: (triangle.a.x + triangle.b.x + triangle.c.x) / 3,
    y: (triangle.a.y + triangle.b.y + triangle.c.y) / 3,
  };
};

export const getRectangleInsideTriangle = (triangle: Triangle): Point[] => {
  const centroid = getTriangleCentroid(triangle);
  // get the direction vector in 4 angles of 45 degrees from the centroid

  // 45 degrees = 0.785398 radians
  const fortyFiveDegInRad = 0.785398;
  // 135 degrees = 2.35619 radians
  const oneThreeFiveDegInRad = 2.35619;
  // 225 degrees = 3.92699 in radians;
  const twoTwoFiveDegInRad = 3.92699;
  // 315 degrees = 5.49779 in radians
  const threeFifteenDegInRad = 5.49779;

  const directionVectors: Point[] = [
    {
        x: Math.cos(fortyFiveDegInRad),
        y: Math.sin(fortyFiveDegInRad),
    },
    {
        x: Math.cos(threeFifteenDegInRad),
        y: Math.sin(threeFifteenDegInRad),
    }
  ];

  console.log("directionVectors", directionVectors);

  const linesOfTriangle: Line[] = [
    { a: triangle.a, b: triangle.b },
    { a: triangle.b, b: triangle.c },
    { a: triangle.c, b: triangle.a },
  ];

  const points: Point[] = [];
  linesOfTriangle.forEach((line) => {
    directionVectors.forEach((v) => {
        const point = intersection(line, centroid, v);
        if (point) {
            points.push(point);
        }
    })
  })

  return points;
};
