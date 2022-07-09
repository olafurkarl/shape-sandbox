export interface Point {
    x: number;
    y: number;
}

export type Direction = Point;

export interface Triangle {
    a: Point;
    b: Point;
    c: Point;
}

export interface Line {
    a: Point;
    b: Point;
}

export interface Quad {
    a: Point;
    b: Point;
    c: Point;
    d: Point;
}

export interface Ray {
    start: Point;
    direction: Direction;
}