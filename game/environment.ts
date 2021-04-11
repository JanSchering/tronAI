import * as React from "react";
import * as tf from "@tensorflow/tfjs";
import { X_START, Y_START, CANVAS_WIDTH, CANVAS_HEIGHT } from "./literals.js";
import { Player } from "./player";
import { Coordinate, Direction, Color } from "./types";
import { getColorCode } from "./utils";

/**
 * @description Take a single time step in the game.
 * @param player1 - The first player of the game.
 * @param player2 - The second player of the game.
 * @param ctx - The Rendering Context of the Canvas.
 */
export const step = (
  player1: Player,
  setP1Coordinates: (coordinates: Coordinate) => void,
  setP2Coordinates: (coordinates: Coordinate) => void,
  setP1Alive: (alive: boolean) => void,
  setP2Alive: (alive: boolean) => void,
  player2: Player,
  ctx: CanvasRenderingContext2D
): void => {
  movePlayer(player1, setP1Coordinates);
  movePlayer(player2, setP2Coordinates);
  setP1Alive(healthCheckup(player1, ctx, player2.color));
  setP2Alive(healthCheckup(player2, ctx, player1.color));
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
  if (player.direction !== Direction.NONE) {
    const positionLookAhead = ctx.getImageData(
      player.coordinates.x,
      player.coordinates.y,
      1,
      1
    ).data;
    const hex = getColorCode(
      positionLookAhead[0],
      positionLookAhead[1],
      positionLookAhead[2]
    );

    alive =
      !(hex === player.color) &&
      !(hex === enemyColor) &&
      player.coordinates.x >= 0 &&
      player.coordinates.x < CANVAS_WIDTH &&
      player.coordinates.y >= 0 &&
      player.coordinates.y < CANVAS_HEIGHT;
  }
  return alive;
};

/**
 * @description Move the player one step in its current direction.
 * @param player
 * @param setCoordinates
 */
export const movePlayer = (
  player: Player,
  setCoordinates: (coordinates: Coordinate) => void
): void => {
  switch (player.direction) {
    case Direction.UP:
      setCoordinates({
        x: player.coordinates.x,
        y: player.coordinates.y - 5,
      });
      break;
    case Direction.DOWN:
      setCoordinates({
        x: player.coordinates.x,
        y: player.coordinates.y + 5,
      });
      break;
    case Direction.LEFT:
      setCoordinates({
        x: player.coordinates.x - 5,
        y: player.coordinates.y,
      });
      break;
    case Direction.RIGHT:
      setCoordinates({
        x: player.coordinates.x + 5,
        y: player.coordinates.y,
      });
      break;
    default:
      break;
  }
};

/**
 * @description Renders the player according to its current position onto the canvas.
 * @param player - The player that we want to render.
 * @param ctx - The Rendering Context of the Canvas.
 */
export const renderPlayer = (player: Player, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = player.color;
  const { x, y } = player.coordinates;
  ctx.fillRect(x, y, 5, 5);
};

/**
 * @description Reset the environment for a new round.
 * @param p1 - The first player.
 * @param p2 - The second player.
 * @param setP1Direction - Setter: Function to set the direction of player1.
 * @param setP1Coordinates - Setter: Function to set the coordinates of player1.
 * @param setP2Coordinates - Setter: Function to set the coordinates of player2.
 * @param setP2Direction - Setter: Function to set the direction of player2.
 * @param ctx - Canvas Rendering Context of the Game Board.
 */
export const reset = (
  p1: Player,
  p2: Player,
  setP1Direction: (direction: Direction) => void,
  setP1Coordinates: (coordinates: Coordinate) => void,
  setP2Coordinates: (coordinates: Coordinate) => void,
  setP2Direction: (Direction: Direction) => void,
  ctx: CanvasRenderingContext2D
) => {
  // Reset the directions of the players
  setP1Direction(Direction.NONE);
  setP2Direction(Direction.NONE);
  // Clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Reset the coordinates of the players to the initial coordinates
  setP1Coordinates({ x: X_START, y: Y_START });
  setP2Coordinates({ x: X_START, y: Y_START * 2 });

  // Render the players in their initial positions
  renderPlayer(p1, ctx);
  renderPlayer(p2, ctx);
};

/**
 * @description Tensorflow Helper-Function: Turns the current state of the canvas into a tensor.
 * @param ctx - The Canvas Rendering Context of the Game board.
 * @returns
 */
export const getStateTensor = (ctx) => {
  //TODO: The Tensor is currently only using the canvas information. Need to also append the current coordinates
  // and the current direction of the player to the Tensor. Those are super important.
  return tf.tidy(() => {
    let imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;

    const downScaled = new Array();
    const red = [];
    const green = [];
    const blue = [];
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
 * @param setP1Direction - Setter: Function to set the direction of Player 1.
 * @param setP2Direction - Setter: Function to set the direction of Player 2.
 */
export const keydownListener = (
  player1: Player,
  player2: Player,
  setP1Direction: (direction: Direction) => void,
  setP2Direction: (direction: Direction) => void
): void => {
  document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    console.log("keydown registered");
    console.log(setP1Direction);
    const prevDirectionP1 = player1.direction;
    const prevDirectionP2 = player2.direction;
    const keyCode = event.keyCode;
    switch (keyCode) {
      case 38:
        if (prevDirectionP1 !== Direction.DOWN) {
          setP1Direction(Direction.UP);
        }
        break;
      case 40:
        if (prevDirectionP1 !== Direction.UP) {
          setP1Direction(Direction.DOWN);
        }
        break;
      case 39:
        if (prevDirectionP1 !== Direction.LEFT) {
          setP1Direction(Direction.RIGHT);
        }
        break;
      case 37:
        if (prevDirectionP1 !== Direction.RIGHT) {
          setP1Direction(Direction.LEFT);
        }
        break;
      case 87:
        if (prevDirectionP2 !== Direction.DOWN) {
          setP2Direction(Direction.UP);
        }
        break;
      case 65:
        if (prevDirectionP2 !== Direction.RIGHT) {
          setP2Direction(Direction.LEFT);
        }
        break;
      case 68:
        if (prevDirectionP2 !== Direction.LEFT) {
          setP2Direction(Direction.RIGHT);
        }
        break;
      case 83:
        if (prevDirectionP2 !== Direction.UP) {
          setP2Direction(Direction.DOWN);
        }
        break;
    }
  });
};
