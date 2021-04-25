import * as React from "react";
import * as tf from "@tensorflow/tfjs";
import {
  P1_STARTING_POS,
  P2_STARTING_POS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  NEON_COLORS,
} from "./literals";
import { Player } from "./player";
import { Direction, Neon_Color, GridCell } from "./types";
import { getColorCode, neonSquare } from "./utils";
import { Grid } from "./grid";

/**
 * @description Take a single time step in the game.
 * @param player1 - The first player of the game.
 * @param player2 - The second player of the game.
 * @param grid - The grid of the playfield.
 */
export const step = (player1: Player, player2: Player, grid: Grid): void => {
  player1.move();
  player2.move();
  player1.alive = healthCheckup(player1, grid);
  player2.alive = healthCheckup(player2, grid);
};

/**
 * @description Checks if the Player is actually still alive or dead
 * @param player - The player to check
 * @param grid - The grid of the playfield.
 * @returns
 */
export const healthCheckup = (player: Player, grid: Grid): boolean => {
  let alive = true;
  if (player.direction !== Direction.NONE) {
    const { rowIdx, colIdx } = player.position;
    alive =
      !grid.isCellFilled(player.position) &&
      rowIdx >= 0 &&
      rowIdx < grid.numRows &&
      colIdx >= 0 &&
      colIdx < grid.numCols;
  }
  return alive;
};

/**
 * @description Renders the player according to its current position onto the canvas.
 * @param player - The player that we want to render.
 * @param ctx - The Rendering Context of the Canvas.
 * @param grid - The grid of the playfield.
 */
export const renderPlayer = (
  player: Player,
  ctx: CanvasRenderingContext2D,
  grid: Grid
): void => {
  const color = player.color;
  const { x, y } = grid.getCoordsForCell(player.position);
  if (!isNeon(color)) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 5, 5);
  } else {
    const { r, g, b } = color;
    neonSquare(x, y, 5, 5, r, g, b, ctx);
  }
};

/**
 * @description Reset the environment for a new round.
 * @param p1 - The first player.
 * @param p2 - The second player.
 * @param ctx - Canvas Rendering Context of the Game Board.
 * @param grid - The grid of the playfield.
 */
export const reset = (
  p1: Player,
  p2: Player,
  ctx: CanvasRenderingContext2D,
  grid: Grid
): Grid => {
  // Reset the directions of the players
  p1.direction = Direction.NONE;
  p2.direction = Direction.NONE;
  // Clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Reset the coordinates of the players to the initial coordinates
  p1.position = P1_STARTING_POS;
  p2.position = P2_STARTING_POS;

  // Render the players in their initial positions
  renderPlayer(p1, ctx, grid);
  renderPlayer(p2, ctx, grid);

  const newGrid = new Grid({
    numRows: grid.numRows,
    numCols: grid.numCols,
    cellHeight: grid.cellHeight,
    cellWidth: grid.cellWidth,
  });

  newGrid.setValue(1, p1.position.rowIdx, p1.position.colIdx);
  newGrid.setValue(1, p2.position.rowIdx, p2.position.colIdx);

  // To prohibit memory issues, we dispose the tensor of the old board
  grid.grid.dispose();

  return newGrid;
};

/**
 * @description Function to initiate the keydownListener for the game Input.
 * @param player1 - The first player.
 * @param player2 - The second player.
 */
export const keydownListener = (player1: Player, player2: Player): void => {
  document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    const prevDirectionP1 = player1.direction;
    const prevDirectionP2 = player2.direction;
    const keyCode = event.keyCode;
    switch (keyCode) {
      case 38:
        if (prevDirectionP1 !== Direction.DOWN) {
          player1.direction = Direction.UP;
        }
        break;
      case 40:
        if (prevDirectionP1 !== Direction.UP) {
          player1.direction = Direction.DOWN;
        }
        break;
      case 39:
        if (prevDirectionP1 !== Direction.LEFT) {
          player1.direction = Direction.RIGHT;
        }
        break;
      case 37:
        if (prevDirectionP1 !== Direction.RIGHT) {
          player1.direction = Direction.LEFT;
        }
        break;
      case 87:
        if (prevDirectionP2 !== Direction.DOWN) {
          player2.direction = Direction.UP;
        }
        break;
      case 65:
        if (prevDirectionP2 !== Direction.RIGHT) {
          player2.direction = Direction.LEFT;
        }
        break;
      case 68:
        if (prevDirectionP2 !== Direction.LEFT) {
          player2.direction = Direction.RIGHT;
        }
        break;
      case 83:
        if (prevDirectionP2 !== Direction.UP) {
          player2.direction = Direction.DOWN;
        }
        break;
    }
  });
};

/**
 * @description Calculates the reward to give a player based on his status, the current step
 * and a parameter to control the logarithmic reward curve.
 * Assumes the steps are counted from 0.
 * @param player - The player to calculate the reward for.
 * @param currentStep - The number of the current step of the game.
 * @param logRewardParam - Controls the logarithmic reward curve.
 * @returns The reward for a player.
 */
const calculateReward = (
  player: Player,
  currentStep: number,
  logRewardParam: number
): number => {
  return player.alive ? logRewardParam * Math.log(currentStep + 1) : -1000;
};

/**
 * @description checks if a Color object is part of the subtype NeonColor
 * @param color - The color to check.
 * @returns
 */
export const isNeon = (color: any): color is Neon_Color => {
  return NEON_COLORS.includes(color);
};
