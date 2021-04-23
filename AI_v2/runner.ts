import { createModel } from "./model";
import { Memory } from "./model_memory";
import * as tf from "@tensorflow/tfjs";
import { Player } from "../game/player";
import { Standard_Color } from "../game/types";
import { P1_STARTING_POS, P2_STARTING_POS } from "../game/literals";

/**
 *
 */
const runAIMode = (props: AIModeProps) => {
  const { numGames, maxStepsPerGame, player1, player2 } = props;
  const p1Model: tf.Sequential = createModel();
  const p2Model: tf.Sequential = createModel();

  for (let i = 0; i < numGames; i++) {
    const memory: Memory = [];
  }
};

type AIModeProps = {
  numGames: number;
  maxStepsPerGame: number;
  player1: Player;
  player2: Player;
  filledCellTracker: any;
};
