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
import {
  Direction,
  Color,
  Standard_Color,
  Neon_Color,
  GridMetaData,
  GridCell,
} from "./types";
import { getColorCode, neonSquare } from "./utils";
import { getCoordsFromGridPos, isCellFilled, getUniqueCellId } from "./grid";

/**
 * @description Take a single time step in the game.
 * @param player1 - The first player of the game.
 * @param player2 - The second player of the game.
 * @param ctx - The Rendering Context of the Canvas.
 * @param gridInfo - Meta Information about the grid of the playfield.
 * @param filledCellTracker - Dictionary to track filled cells.
 */
export const step = (
  player1: Player,
  player2: Player,
  ctx: CanvasRenderingContext2D,
  gridInfo: GridMetaData,
  filledCellTracker: object
): void => {
  player1.move();
  player2.move();
  player1.alive = healthCheckup(player1, gridInfo, filledCellTracker);
  player2.alive = healthCheckup(player2, gridInfo, filledCellTracker);
};

/**
 * @description Checks if the Player is actually still alive or dead
 * @param player - The player to check
 * @param gridInfo - Meta Data about the grid of the playfield.
 * @param filledCellTracker - Object to keep track of which cells are filled.
 * @returns
 */
export const healthCheckup = (
  player: Player,
  gridInfo: GridMetaData,
  filledCellTracker: any
): boolean => {
  let alive = true;
  if (player.direction !== Direction.NONE) {
    const { rowIdx, colIdx } = player.position;
    const { numRows, numCols } = gridInfo;
    const cellID = getUniqueCellId(player.position);
    alive =
      !filledCellTracker[cellID] &&
      rowIdx >= 0 &&
      rowIdx < numRows &&
      colIdx >= 0 &&
      colIdx < numCols;
  }
  return alive;
};

/**
 * @description Renders the player according to its current position onto the canvas.
 * @param player - The player that we want to render.
 * @param ctx - The Rendering Context of the Canvas.
 * @param gridInfo - Meta Data about the grid of the playfield.
 */
export const renderPlayer = (
  player: Player,
  ctx: CanvasRenderingContext2D,
  gridInfo: GridMetaData
): void => {
  const color = player.color;
  const { x, y } = getCoordsFromGridPos(gridInfo, player.position);
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
 * @param gridInfo - Meta Data of the grid of the playfield.
 */
export const reset = (
  p1: Player,
  p2: Player,
  ctx: CanvasRenderingContext2D,
  gridInfo: GridMetaData
): void => {
  // Reset the directions of the players
  p1.direction = Direction.NONE;
  p2.direction = Direction.NONE;
  // Clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Reset the coordinates of the players to the initial coordinates
  p1.position = P1_STARTING_POS;
  p2.position = P2_STARTING_POS;

  // Render the players in their initial positions
  renderPlayer(p1, ctx, gridInfo);
  renderPlayer(p2, ctx, gridInfo);
};

/**
 * @description Tensorflow Helper-Function: Turns the current state of the canvas into a tensor.
 * @param ctx - The Canvas Rendering Context of the Game board.
 * @returns
 */
export const getStateTensor = (ctx: CanvasRenderingContext2D): tf.Tensor1D => {
  //TODO: The Tensor is currently only using the canvas information. Need to also append the current coordinates
  // and the current direction of the player to the Tensor. Those are super important.
  return tf.tidy(() => {
    let imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;

    const downScaled = new Array();
    const red: number[] = [];
    const green: number[] = [];
    const blue: number[] = [];
    imageData.forEach((channel, idx) => {
      switch (idx % 4) {
        case 0:
          red.push(channel > 0 ? 1 : 0);
          break;
        case 1:
          green.push(channel > 0 ? 1 : 0);
          break;
        case 2:
          blue.push(channel > 0 ? 1 : 0);
          break;
        default:
          break;
      }
    });

    for (var i = 0; i < CANVAS_HEIGHT; i = i + 5) {
      for (var j = 0; j < CANVAS_WIDTH; j = j + 5) {
        const arrayIdx = i * CANVAS_WIDTH + j;
        downScaled.push(
          red[arrayIdx] + green[arrayIdx] + blue[arrayIdx] > 0 ? 1 : 0
        );
      }
    }

    return tf
      .tensor(downScaled)
      .reshape([1, (CANVAS_HEIGHT / 5) * (CANVAS_WIDTH / 5)]);
  });
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
