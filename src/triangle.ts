import { lineRayIntersection, onOneSide } from "./lineIntersect";
import { Direction, Line, Point, Quad, Triangle } from "./types";

// The centroid of a triangle = ((x1+x2+x3)/3, (y1+y2+y3)/3)
export const getTriangleCentroid = (triangle: Triangle): Point => {
  return {
    x: (triangle.a.x + triangle.b.x + triangle.c.x) / 3,
    y: (triangle.a.y + triangle.b.y + triangle.c.y) / 3,
  };
};

export const getLinesOfTriangle = (triangle: Triangle): Line[] => {
  return [
    { a: triangle.a, b: triangle.b },
    { a: triangle.b, b: triangle.c },
    { a: triangle.c, b: triangle.a },
  ];
};

export const getRectangleInsideTriangle = (triangle: Triangle): Point[] => {
  const centroid = getTriangleCentroid(triangle);
  // get the direction vector in 4 angles of 45 degrees from the centroid

  // 45 degrees = 0.785398 radians
  const fortyFiveDegInRad = 0.785398;
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
    },
  ];

  const linesOfTriangle: Line[] = getLinesOfTriangle(triangle);

  const points: Point[] = [];
  linesOfTriangle.forEach((line) => {
    directionVectors.forEach((v) => {
      const point = lineRayIntersection(line, {
        start: centroid,
        direction: v,
      });
      if (point) {
        points.push(point);
      }
    });
  });

  return points;
};

export function lineDistance(p1: Point, p2: Point): number;
export function lineDistance(line: Line): number;
export function lineDistance(p1OrLine: Point | Line, p2?: Point): number {
  if ("a" in p1OrLine) {
    return Math.hypot(p1OrLine.b.x - p1OrLine.a.x, p1OrLine.b.y - p1OrLine.a.y);
  }
  if (p2) {
    return Math.hypot(p2.x - p1OrLine.x, p2.y - p1OrLine.y);
  }

  throw Error("Invalid parameters supplied.");
}

// export const lineDistance = (p1: Point, p2: Point) => {
//   return Math.hypot(p2.x - p1.x, p2.y - p1.y);
// };

type MarkedRectangle = Record<
  "topLeft" | "topRight" | "bottomRight" | "bottomLeft",
  Point
>;

const getMinDistance = (points: Point[], line: Line, direction: Point) => {
  return Math.min(
    ...points
      .map((p) => ({
        p,
        intersection: lineRayIntersection(line, {
          start: p,
          direction,
        }),
      }))
      .filter((p) => p.intersection)
      .map((p) => lineDistance(p.intersection as Point, p.p))
  );
};

const bothIntersect = (points: Point[], line: Line, direction: Direction) => {
  return points.every((p) =>
    lineRayIntersection(line, {
      start: p,
      direction,
    })
  );
};

/**
 *
 * @param origins points to test right angle rays from
 * @param lines
 */
export const getRightAngleIntersections = (
  origins: MarkedRectangle,
  lines: Line[]
) => {
  const resultLines: Line[] = [];
  // get all horizontal rays (4)
  const horizontalDirection = {
    x: Math.cos(0),
    y: Math.sin(0),
  };

  let whichHorizontal: 'Left' | 'Right' | 'Neither' = 'Neither';
  const pairRight = [origins.topRight, origins.bottomRight];
  const pairLeft = [origins.topLeft, origins.bottomLeft];
  const results: {
    horizontal?: {
        x: number;
        which: 'Left' | 'Right';
    };
    vertical?: number;
  } = {};

  lines.forEach((l) => {
    whichHorizontal = 'Neither';
    const candidateLines: (Line & { dest: Point })[] = [];
    const minDistanceRight = getMinDistance(pairRight, l, horizontalDirection);
    const minDistanceLeft = getMinDistance(pairLeft, l, horizontalDirection);

    // Pair is already adjacent to a line in this direction so it can't move closer
    if (Math.floor(Math.min(minDistanceRight, minDistanceLeft)) === 0) {
      return;
    }
    const closerPair = minDistanceRight < minDistanceLeft ? pairRight : pairLeft;

    if (!bothIntersect(closerPair, l, horizontalDirection)) {
      console.log("both closer pairs dont intersect");
      return;
    } else {
        console.log("at least one pair intersects")
    }

    whichHorizontal = minDistanceRight < minDistanceLeft ? 'Right' : 'Left';

    console.log("minDistance", Math.min(minDistanceRight, minDistanceLeft));
    closerPair.forEach((o) => {
      const ray = {
        start: o,
        direction: horizontalDirection,
      };
      if (onOneSide(ray, l)) {
        return;
      }
      const point = lineRayIntersection(l, ray);
      if (point) {
        console.log("candidate distance", lineDistance(o, point))
        candidateLines.push({ a: o, b: point, dest: point });
      }
    });
    // sort by line distance
    // candidateLines.sort((a, b) => lineDistance(b.a, b.b) - lineDistance(a.a, a.b));

    // resultLines.push(...candidateLines.splice(2, 2).filter((l) => lineDistance(l.a, l.b) > 0));
    const sorted = candidateLines
    .map((line) => ({ line, distance: lineDistance(line.a, line.b) }))
    .sort((a, b) => a.distance - b.distance);
    console.log("sorted", sorted)
    const newX = sorted
    .at(0)?.line.dest.x;

    console.log("newX", newX, whichHorizontal)
    if (!newX) return;
    results.horizontal = {
        x: newX,
        which: whichHorizontal
    }
    resultLines.push(...candidateLines);
  });

    if (results.horizontal) {
        const { which, x } = results.horizontal;
        console.log("modifying right")
        if (which === 'Left') {
            console.log("modifying left")
            console.log(`replaced ${origins.bottomLeft.x} with ${x}`)
            console.log(`replaced ${origins.topLeft.x} with ${x}`)
            origins.bottomLeft.x = x;
            origins.topLeft.x = x;
        }
        if (which === 'Right') {
            console.log("modifying right")
            console.log(`replaced ${origins.bottomRight.x} with ${x}`)
            console.log(`replaced ${origins.topRight.x} with ${x}`)
            origins.topRight.x = x;
            origins.bottomRight.x = x;
        }
    }


  // get all vertical rays (4)
  //   const ninetyDegreesInRad = 90 * (Math.PI / 180);
  //   const verticalDirection = {
  //     x: Math.cos(ninetyDegreesInRad),
  //     y: Math.sin(ninetyDegreesInRad),
  //   };

  //   origins.forEach((o) => {
  //     lines.forEach((l) => {
  //       const ray = {
  //         start: o,
  //         direction: verticalDirection,
  //       };
  //     //   if (!onOneSide(ray, l)) {
  //     //     return;
  //     //   }
  //       const point = lineRayIntersection(l, ray);
  //       if (point) {
  //         resultLines.push({ a: o, b: point });
  //       }
  //     });
  //   });

  console.log(resultLines.length);

  return resultLines;

  // find each point that's on the interaction of the rays
};

export const getCandidateLinesFromTrianglePoints = (points: Point[]) => {
  const sortByX = [...points.sort((a, b) => a.x - b.x).map((p) => p.x)];
  const sortByY = [...points.sort((a, b) => a.y - b.y).map((p) => p.y)];

  console.log();
  return {
    topRight: {
      x: sortByX[2],
      y: sortByY[1],
    },
    topLeft: {
      x: sortByX[1],
      y: sortByY[1],
    },
    bottomLeft: {
      x: sortByX[1],
      y: sortByY[2],
    },
    bottomRight: {
      x: sortByX[2],
      y: sortByY[2],
    },
  };
};
