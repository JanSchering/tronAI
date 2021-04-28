import { NUM_ACTIONS, NUM_INPUTS } from "./model_constants";
import * as tf from "@tensorflow/tfjs";
import { Player } from "../game/player";
import { Direction } from "../game/types";
import { Grid } from "../game/grid";

/**
 * @description Tensorflow Helper-Function: Turns the current state of the canvas into a tensor.
 */
export const getStateTensor = (props: Props): tf.Tensor1D => {
  const { player1, player2, grid } = props;

  let state: number[] = [];

  /*
   * To build up the state Tensor, the first thing we do is signal the current direction of both Players.
   */
  const p1Actions = Array.from(tf.zeros([NUM_ACTIONS]).dataSync());
  if (player1.direction !== Direction.NONE) p1Actions[player1.direction] = 1;

  const p2Actions = Array.from(tf.zeros([NUM_ACTIONS]).dataSync());
  if (player2.direction !== Direction.NONE) p1Actions[player2.direction] = 1;

  state = state.concat(p1Actions);
  state = state.concat(p2Actions);

  /*
   * After signaling the current direction in the Tensor, it makes sense to also provide the current position
   * of both players.
   * We have to be careful though: All other inputs are moving in a range from 0 to 1.
   * Using the pure position could be causing issues with the corrdinates being weighted way too high since these
   * would be way larger than 1 on average.
   * To solve that we have to fit the position into a 0-1 range.
   */
  // Naive approach: we just divide the cell indices by the total amount to get a range between 0 and 1
  state.push(player1.position.rowIdx / grid.numRows);
  state.push(player1.position.colIdx / grid.numCols);
  state.push(player2.position.rowIdx / grid.numRows);
  state.push(player2.position.colIdx / grid.numCols);

  /**
   * Finally, we have to provide an overview over the state of the board and return the complete overview as a tf Tensor.
   */
  return tf.tensor(state.concat(grid.gridAsArray)).reshape([1, NUM_INPUTS]);
};

type Props = {
  player1: Player;
  player2: Player;
  grid: Grid;
};
