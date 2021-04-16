import * as React from "react";
import * as tf from "@tensorflow/tfjs";
import {
  X_START,
  Y_START,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  NEON_COLORS,
} from "./literals";
import { Player } from "./player";
import { Direction, Color, Standard_Color, Neon_Color } from "./types";
import { getColorCode, neonSquare } from "./utils";

/**
 * @description Take a single time step in the game.
 * @param player1 - The first player of the game.
 * @param player2 - The second player of the game.
 * @param ctx - The Rendering Context of the Canvas.
 */
export const step = (
  player1: Player,
  player2: Player,
  ctx: CanvasRenderingContext2D
): void => {
  player1.move();
  player2.move();
  player1.setAlive(healthCheckup(player1, ctx, player2.getColor()));
  player2.setAlive(healthCheckup(player2, ctx, player1.getColor()));
};

/**
 * @description Checks if the Player is actually still alive or dead
 * @param player - The player to check
 * @param ctx - Canvas Rendering Context of the Game Canvas.
 * @param enemyColor - The color of the enemy.
 * @returns
 */
export const healthCheckup = (
  player: Player,
  ctx: CanvasRenderingContext2D,
  enemyColor: Color
): boolean => {
  let alive = true;
  if (player.getDirection() !== Direction.NONE) {
    const { x, y } = player.getCoordinates();

    const positionLookAhead = ctx.getImageData(x, y, 1, 1).data;
    const hex = getColorCode(
      positionLookAhead[0],
      positionLookAhead[1],
      positionLookAhead[2]
    );

    alive =
      !(hex === player.getColor()) &&
      !(hex === enemyColor) &&
      x >= 0 &&
      x < CANVAS_WIDTH &&
      y >= 0 &&
      y < CANVAS_HEIGHT;
  }
  return alive;
};

/**
 * @description Renders the player according to its current position onto the canvas.
 * @param player - The player that we want to render.
 * @param ctx - The Rendering Context of the Canvas.
 */
export const renderPlayer = (
  player: Player,
  ctx: CanvasRenderingContext2D
): void => {
  const color = player.getColor();
  if (!isNeon(color)) {
    ctx.fillStyle = color;
    const { x, y } = player.getCoordinates();
    ctx.fillRect(x, y, 5, 5);
  } else {
    //TODO: Neon Color implementation here
  }
};

/**
 * @description Reset the environment for a new round.
 * @param p1 - The first player.
 * @param p2 - The second player.
 * @param ctx - Canvas Rendering Context of the Game Board.
 */
export const reset = (
  p1: Player,
  p2: Player,
  ctx: CanvasRenderingContext2D
): void => {
  // Reset the directions of the players
  p1.setDirection(Direction.NONE);
  p2.setDirection(Direction.NONE);
  // Clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Reset the coordinates of the players to the initial coordinates
  p1.setCoordinates({ x: X_START, y: Y_START });
  p2.setCoordinates({ x: X_START, y: Y_START * 2 });

  // Render the players in their initial positions
  renderPlayer(p1, ctx);
  renderPlayer(p2, ctx);
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
    const prevDirectionP1 = player1.getDirection();
    const prevDirectionP2 = player2.getDirection();
    const keyCode = event.keyCode;
    switch (keyCode) {
      case 38:
        if (prevDirectionP1 !== Direction.DOWN) {
          player1.setDirection(Direction.UP);
        }
        break;
      case 40:
        if (prevDirectionP1 !== Direction.UP) {
          player1.setDirection(Direction.DOWN);
        }
        break;
      case 39:
        if (prevDirectionP1 !== Direction.LEFT) {
          player1.setDirection(Direction.RIGHT);
        }
        break;
      case 37:
        if (prevDirectionP1 !== Direction.RIGHT) {
          player1.setDirection(Direction.LEFT);
        }
        break;
      case 87:
        if (prevDirectionP2 !== Direction.DOWN) {
          player2.setDirection(Direction.UP);
        }
        break;
      case 65:
        if (prevDirectionP2 !== Direction.RIGHT) {
          player2.setDirection(Direction.LEFT);
        }
        break;
      case 68:
        if (prevDirectionP2 !== Direction.LEFT) {
          player2.setDirection(Direction.RIGHT);
        }
        break;
      case 83:
        if (prevDirectionP2 !== Direction.UP) {
          player2.setDirection(Direction.DOWN);
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
  return player.getAlive() ? logRewardParam * Math.log(currentStep + 1) : -1000;
};

/**
 * @description checks if a Color object is part of the subtype NeonColor
 * @param color - The color to check.
 * @returns
 */
export const isNeon = (color: any): color is Neon_Color => {
  return NEON_COLORS.includes(color);
};
