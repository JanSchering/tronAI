export enum Color {
  RED = "#ff0000",
  GREEN = "#33cc33",
  BLUE = "#0066ff",
  YELLOW = "#ffff00",
}

export enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
  NONE = 4,
}

export type Coordinate = {
  x: number;
  y: number;
};
