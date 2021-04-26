import { createModel } from "./model";
import { Memory } from "./model_memory";
import {
  chooseAction,
  calculateReward,
  replayExperience,
} from "./model_functions";
import { NUM_INPUTS } from "./model_constants";
import * as tf from "@tensorflow/tfjs";
import { Player } from "../game/player";
import { Grid } from "../game/grid";
import { Direction, Standard_Color } from "../game/types";
import {
  P1_STARTING_POS,
  P2_STARTING_POS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../game/literals";
import { renderPlayers, step } from "../game/environment";
import { getStateTensor } from "./state";

/**
 * @description Runs the Training mode of the AI system.
 * TODO: Do we need two models or is it actually better to have just
 * one model and have it play against itself?
 */
const runAITrainingMode = async (props: AIModeProps) => {
  const { numGames, maxStepsPerGame, ctx } = props;
  const p1Model: tf.Sequential = createModel();
  const p2Model: tf.Sequential = createModel();

  for (let i = 0; i < numGames; i++) {
    const p1Memory: Memory = [];
    const p2Memory: Memory = [];

    const grid = new Grid({
      numRows: CANVAS_HEIGHT / PLAYER_HEIGHT,
      numCols: CANVAS_WIDTH / PLAYER_WIDTH,
      cellHeight: PLAYER_HEIGHT,
      cellWidth: PLAYER_WIDTH,
    });

    const player1 = new Player({
      color: Standard_Color.RED,
      name: "player1",
      position: P1_STARTING_POS,
    });

    const player2 = new Player({
      color: Standard_Color.BLUE,
      name: "player2",
      position: P2_STARTING_POS,
    });

    grid.setValue(1, P1_STARTING_POS);
    grid.setValue(1, P2_STARTING_POS);

    renderPlayers([player1, player2], ctx, grid);

    let current_step = 0;
    let epsilon = 0.98;
    let p1Reward = 0;
    let p2Reward = 0;
    let logRewardParam = 1;
    let discountFactor = 0.95;

    // we define the state outside the loop so we can use it afterwards
    let state = getStateTensor({ player1, player2, grid });

    while (current_step < maxStepsPerGame) {
      const p1Action = chooseAction(p1Model, state, epsilon);
      const p2Action = chooseAction(p2Model, state, epsilon);

      /*
       * The predicted actions can be used to set the direction of the players.
       */
      player1.direction = p1Action;
      player2.direction = p2Action;

      /*
       * Now we can move the players and collect their reward
       */
      step(player1, player2, grid);
      p1Reward = calculateReward(player1, current_step, logRewardParam);
      p2Reward = calculateReward(player2, current_step, logRewardParam);

      let nextState: tf.Tensor1D;

      if (!player1.alive || !player2.alive) {
        nextState = null;

        p1Memory.push({
          state,
          action: p1Action,
          reward: p1Reward,
          nextState,
        });

        p2Memory.push({
          state,
          action: p2Action,
          reward: p2Reward,
          nextState,
        });

        break;
      } else {
        nextState = getStateTensor({ player1, player2, grid });

        p1Memory.push({
          state,
          action: p1Action,
          reward: p1Reward,
          nextState,
        });

        p2Memory.push({
          state,
          action: p2Action,
          reward: p2Reward,
          nextState,
        });

        state = nextState;
        renderPlayers([player1, player2], ctx, grid);
      }
    }

    /*
     * After one game ran through, we can use the collected memories to train the models, letting
     * them replay their experiences.
     */
    await replayExperience({
      model: p1Model,
      model_memory: p1Memory,
      discountFactor,
    });

    await replayExperience({
      model: p2Model,
      model_memory: p2Memory,
      discountFactor,
    });
  }
};

type AIModeProps = {
  numGames: number;
  maxStepsPerGame: number;
  ctx: CanvasRenderingContext2D;
  epsilon?: number;
  logRewardParam?: number;
  discountFactor?: number;
};
