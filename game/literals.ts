import { Neon_Color } from "./types";

//BASE NUMBER THAT CAN BE USED AS A STARTING COORDINATE FOR THE CANVAS
const X_START = 150;
const Y_START = 150;

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
  X_START,
  Y_START,
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
