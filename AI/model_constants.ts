import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../game/literals";

/**
 * There are 5 directions a player can theoretically have: [UP, DOWN, LEFT, RIGHT, NONE].
 * However, once a player begins moving it should not be possible for them to stop.
 * To simplify this, we dont want to offer NONE as an action at all
 */
const NUM_ACTIONS = 4;

/**
 * We need to provide the current row index and column index for both players
 */
const NUM_POSITION_INDICE = 4;

/**
 * We have separated our canvas into a grid. We need an Input for each cell that can be filled.
 * We also need one input for the current coordinates of the player and the current direction
 * TODO: Do the coordinates and direction have to be normalized? Seeing as they would be the only inputs > 1.
 */
const NUM_INPUTS =
  (CANVAS_WIDTH / PLAYER_WIDTH) * (CANVAS_HEIGHT / PLAYER_HEIGHT) +
  NUM_ACTIONS * 2 +
  NUM_POSITION_INDICE;

/**
 * For now, the number of outputs will just be the number of actions.
 * TODO: Maybe we can add an output unit that can be fed back as input to the network?
 */
const NUM_OUTPUTS = NUM_ACTIONS;

/**
 * The size of the first hidden layer will be roughly 2/3 of the input layer + the number of output units.
 */
const LAYER_1_UNITS = Math.floor((NUM_INPUTS / 3) * 2) + NUM_OUTPUTS;

/**
 * The second hidden layer will take a larger step in sizing down. It will have roughly half the units of Layer 1
 */
const LAYER_2_UNITS = Math.floor(LAYER_1_UNITS / 2);

/**
 * The third hidden layer lowers even further down to a third of layer 2.
 */
const LAYER_3_UNITS = Math.floor(LAYER_2_UNITS / 3);

/**
 * The fourth hidden layer will reduce the size of the units down to 100.
 */
const LAYER_4_UNITS = 100;

export {
  NUM_INPUTS,
  NUM_OUTPUTS,
  NUM_ACTIONS,
  LAYER_1_UNITS,
  LAYER_2_UNITS,
  LAYER_3_UNITS,
  LAYER_4_UNITS,
};
