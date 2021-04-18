import { GridCell, Neon_Color } from "./types";

const P1_STARTING_POS: GridCell = {
  rowIdx: 15,
  colIdx: 10,
};
const P2_STARTING_POS: GridCell = {
  rowIdx: 30,
  colIdx: 10,
};

//THE HEIGHT AND WIDTH OF THE CANVAS IN THE HTML
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;

const PLAYER_WIDTH = 5;
const PLAYER_HEIGHT = 5;

const NEON_RED: Neon_Color = {
  r: 243,
  g: 20,
  b: 21,
};
const NEON_GREEN: Neon_Color = {
  r: 20,
  g: 243,
  b: 20,
};
const NEON_BLUE: Neon_Color = {
  r: 20,
  g: 20,
  b: 243,
};
const NEON_YELLOW: Neon_Color = {
  r: 230,
  g: 240,
  b: 20,
};

const NEON_COLORS: Neon_Color[] = [
  NEON_BLUE,
  NEON_RED,
  NEON_YELLOW,
  NEON_GREEN,
];

export {
  P1_STARTING_POS,
  P2_STARTING_POS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  NEON_RED,
  NEON_GREEN,
  NEON_BLUE,
  NEON_YELLOW,
  NEON_COLORS,
};
