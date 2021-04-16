export enum Color {
  RED = "#ff0000",
  GREEN = "#33cc33",
  BLUE = "#0066ff",
  YELLOW = "#ffff00",
  NEON_RED = "neon_red",
  NEON_BLUE = "neon_blue",
  NEON_GREEN = "neon_green",
  NEON_YELLOW = "neon_yellow",
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
