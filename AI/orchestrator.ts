import { Player } from "../game/player";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  X_START,
  Y_START,
} from "../game/literals";
import { Model } from "./model";
import { Memory } from "./memory";
import { Standard_Color } from "../game/types";
import { getStateTensor, step, reset, renderPlayer } from "../game/environment";
import * as tf from "@tensorflow/tfjs";

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

export class Orchestrator {
  canvas: HTMLCanvasElement;
  player1: Player;
  player2: Player;
  p1Model: Model;
  p2Model: Model;
  memory: Memory;
  discountRate: number;
  maxStepsPerGame: number;
  epsilon: number;
  steps: number;
  rewardStore: Array<[number, number]>;
  logRewardParam: number;
  inputShape: tf.Shape;

  constructor(
    canvas: HTMLCanvasElement,
    p1Model: Model,
    p2Model: Model,
    memory: Memory,
    discountRate: number,
    maxStepsPerGame: number,
    logRewardParam: number,
    inputShape: tf.Shape
  ) {
    this.canvas = canvas;
    this.player1 = new Player({
      name: "p1",
      color: Standard_Color.RED,
      coordinates: {
        x: X_START,
        y: Y_START,
      },
    });
    this.player2 = new Player({
      name: "p2",
      color: Standard_Color.BLUE,
      coordinates: {
        x: X_START,
        y: Y_START * 2,
      },
    });
    this.memory = memory;
    this.p1Model = p1Model;
    this.p2Model = p2Model;

    // The exploration parameter
    this.epsilon = MAX_EPSILON;

    // Keep track of the elapsed steps
    this.steps = 0;
    this.maxStepsPerGame = maxStepsPerGame;
    this.discountRate = discountRate;
    this.logRewardParam = logRewardParam;
    this.inputShape = inputShape;

    // Initialization of the rewards container
    // We will be saving rewards in pairs [player1, player2]
    this.rewardStore = new Array();
  }

  getReward(player: Player) {
    return player.getAlive()
      ? this.logRewardParam * Math.log(this.steps + 1)
      : -1000;
  }

  async run() {
    let ctx = this.canvas.getContext("2d");
    let state = getStateTensor(ctx);
    let p1Reward = 0;
    let p2Reward = 0;
    var handler = setInterval(() => {
      const p1Action: number = this.p1Model.chooseAction(state, this.epsilon);
      this.player1.setDirection(p1Action);

      const p2Action: number = this.p2Model.chooseAction(state, this.epsilon);
      this.player2.setDirection(p2Action);

      step(this.player1, this.player2, ctx);

      let done = false;

      if (!this.player1.getAlive() || !this.player2.getAlive()) {
        done = true;
      }

      p1Reward = this.getReward(this.player1);
      p2Reward = this.getReward(this.player2);

      let nextState = getStateTensor(this.canvas.getContext("2d"));

      if (done) nextState = null;

      this.memory.addSample([
        state,
        [p1Action, p2Action],
        [p1Reward, p2Reward],
        nextState,
      ]);

      this.steps += 1;
      // Exponentially decay the exploration parameter
      this.epsilon =
        MIN_EPSILON +
        (MAX_EPSILON - MIN_EPSILON) * Math.exp(-LAMBDA * this.steps);

      state = nextState;

      if (done || this.steps == this.maxStepsPerGame) {
        this.rewardStore.push([p1Reward, p2Reward]);
        reset(this.player1, this.player2, this.canvas.getContext("2d"));
        this.steps = 0;
        clearInterval(handler);
      } else {
        renderPlayer(this.player1, ctx);
        renderPlayer(this.player2, ctx);
      }
    }, 33);
    await this.replay();
  }

  async replay() {
    // Sample from memory
    const batch = this.memory.sample(this.p1Model.batchSize);
    const states = batch.map(([state, , ,]) => state);
    const nextStates = batch.map(([, , , nextState]) =>
      nextState ? nextState : tf.zeros(this.inputShape)
    );

    // Predict the values of each action at each state for both players
    const p1Preds: tf.Tensor<tf.Rank>[] = [];
    const p2Preds: tf.Tensor<tf.Rank>[] = [];
    states.forEach((state) => {
      p1Preds.push(<tf.Tensor<tf.Rank>>this.p1Model.predict(state));
      p2Preds.push(<tf.Tensor<tf.Rank>>this.p2Model.predict(state));
    });

    // Predict the values of each action at each next state
    const p1FortuneTelling: tf.Tensor<tf.Rank>[] = [];
    const p2FortuneTelling: tf.Tensor<tf.Rank>[] = [];
    nextStates.forEach((nextState) => {
      p1FortuneTelling.push(
        <tf.Tensor<tf.Rank>>this.p1Model.predict(nextState)
      );
      p2FortuneTelling.push(
        <tf.Tensor<tf.Rank>>this.p2Model.predict(nextState)
      );
    });

    let x = new Array();
    let p1Label = new Array();
    let p2Label = new Array();

    // Update the states rewards with the discounted next states rewards
    batch.forEach(
      (
        [state, [p1Action, p2Action], [p1Reward, p2Reward], nextState]: [
          tf.Tensor<tf.Rank.R4>,
          [number, number],
          [number, number],
          tf.Tensor
        ],
        index: number
      ) => {
        let current_P1_Q_val: any = p1Preds[index];
        let current_P2_Q_val: any = p2Preds[index];

        //We have to check if the nextState is empty to update the rewards
        if (nextState) {
          current_P1_Q_val[p1Action] =
            p1Reward +
            this.discountRate *
              <number>(<unknown>p1FortuneTelling[index].max().dataSync());
          current_P2_Q_val =
            p2Reward +
            this.discountRate *
              <number>(<unknown>p2FortuneTelling[index].max().dataSync());
        } else {
          current_P1_Q_val[p1Action] = <any>p1Reward;
          current_P2_Q_val[p2Action] = <any>p2Reward;
        }

        x.push(state.dataSync());
        p1Label.push(current_P1_Q_val.dataSync());
        p2Label.push(current_P2_Q_val.dataSync());
      }
    );

    // Clean unused tensors
    p1Preds.forEach((state) => state.dispose());
    p2Preds.forEach((state) => state.dispose());
    p1FortuneTelling.forEach((state) => state.dispose());
    p2FortuneTelling.forEach((state) => state.dispose());

    // Reshape the batches to be fed to the network
    let x_shaped = tf
      .tensor(x)
      .reshape([this.p1Model.batchSize, CANVAS_HEIGHT * CANVAS_WIDTH]);
    let p1Label_shaped: tf.Tensor2D = tf.tensor2d(p1Label, [
      p1Label.length,
      this.p1Model.numActions,
    ]);
    let p2Label_shaped: tf.Tensor2D = tf.tensor2d(p2Label, [
      p2Label.length,
      this.p2Model.numActions,
    ]);

    // Learn the Q(s, a) values given associated discounted rewards
    await this.p1Model.train(<any>x_shaped, <any>p1Label_shaped);
    await this.p2Model.train(<any>x_shaped, <any>p2Label_shaped);

    x_shaped.dispose();
    p1Label_shaped.dispose();
    p2Label_shaped.dispose();
  }
}
