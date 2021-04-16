export type Color = Standard_Color | Neon_Color;

export enum Standard_Color {
  RED = "#ff0000",
  GREEN = "#33cc33",
  BLUE = "#0066ff",
  YELLOW = "#ffff00",
}

export type Neon_Color = {
  r: number;
  g: number;
  b: number;
};

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

export type GridMetaData = {
  numRows: number;
  numCols: number;
  playerWidth: number;
  playerHeight: number;
};

export type GridCell = {
  colIdx: number;
  rowIdx: number;
};
