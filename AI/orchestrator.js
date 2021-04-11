import { Environment } from "../game/environment.js";
import { Player } from "../game/player.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  X_START,
  Y_START,
} from "../game/literals";

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

export class Orchestrator {
  constructor(canvas, p1Model, p2Model, memory, discountRate, maxStepsPerGame) {
    this.canvas = canvas;
    this.p1 = new Player("red", "player1", X_START, Y_START);
    this.p2 = new Player("blue", "player2", X_START, Y_START * 2);
    this.env = new Environment(this.p1, this.p2, this.canvas, false);
    this.memory = memory;
    this.p1Model = p1Model;
    this.p2Model = p2Model;

    // The exploration parameter
    this.eps = MAX_EPSILON;

    // Keep track of the elapsed steps
    this.steps = 0;
    this.maxStepsPerGame = maxStepsPerGame;

    this.discountRate = discountRate;

    // Initialization of the rewards container
    // We will be saving rewards in pairs [player1, player2]
    this.rewardStore = new Array();
  }

  getReward(player) {
    return player.isAlive() ? 1 : 0;
  }

  async run() {
    let state = this.env.getStateTensor();
    let p1Reward = 0;
    let p2Reward = 0;
    let logRewardParam = 1; // we want logarithmic growth of the reward
    let rewardCounter = 1;
    let step = 0;
    var handler = setInterval(() => {
      const p1Action = this.p1Model.chooseAction(state, this.eps);
      this.env.player1.setDirectionNumeric(p1Action);

      const p2Action = this.p2Model.chooseAction(state, this.eps);
      this.env.player2.setDirectionNumeric(p2Action);

      this.env.step();

      let done = false;
      if (!this.env.player1.isAlive()) {
        p1Reward = -p1Reward;
        p2Reward = logRewardParam * Math.log(rewardCounter);
        done = true;
      } else if (!this.env.player2.isAlive()) {
        p2Reward = -p2Reward;
        p1Reward = logRewardParam * Math.log(rewardCounter);
        done = true;
      } else {
        p1Reward = logRewardParam * Math.log(rewardCounter);
        p2Reward = logRewardParam * Math.log(rewardCounter);
      }

      let nextState = this.env.getStateTensor();

      if (done) nextState = null;

      this.memory.addSample([
        state,
        [p1Action, p2Action],
        [p1Reward, p2Reward],
        nextState,
      ]);

      this.steps += 1;
      // Exponentially decay the exploration parameter
      this.eps =
        MIN_EPSILON +
        (MAX_EPSILON - MIN_EPSILON) * Math.exp(-LAMBDA * this.steps);

      state = nextState;
      step += 1;

      if (done || step == this.maxStepsPerGame) {
        this.rewardStore.push([p1Reward, p2Reward]);
        this.env.reset();
        clearInterval(handler);
      } else {
        this.env.renderPlayer(this.env.player1);
        this.env.renderPlayer(this.env.player2);
      }
    }, 33);
    await this.replay;
  }

  async replay() {
    // Sample from memory
    const batch = this.memory.sample(this.model.batchSize);
    const states = batch.map(([state, , ,]) => state);
    const nextStates = batch.map(([, , , nextState]) =>
      nextState ? nextState : tf.zeros([this.model.numStates])
    );

    // Predict the values of each action at each state for both players
    const p1Preds = [];
    const p2Preds = [];
    states.forEach((state) => {
      p1Preds.push(this.p1Model.predict(state));
      p2Preds.push(this.p2Model.predict(state));
    });

    // Predict the values of each action at each next state
    const p1FortuneTelling = [];
    const p2FortuneTelling = [];
    nextStates.forEach((nextState) => {
      p1FortuneTelling.push(this.p1Model.predict(nextState));
      p2FortuneTelling.push(this.p2Model.predict(nextState));
    });

    let x = new Array();
    let p1Label = new Array();
    let p2Label = new Array();

    // Update the states rewards with the discounted next states rewards
    batch.forEach(([state, action, reward, nextState], index) => {
      const current_P1_Q_val = p1Preds[index];
      const current_P2_Q_val = p2Preds[index];

      //We have to check if the nextState is empty to update the rewards
      if (nextState) {
        current_P1_Q_val =
          reward[0] +
          this.discountRate * p1FortuneTelling[index].max().dataSync();
        current_P2_Q_val =
          reward[1] +
          this.discountRate * p2FortuneTelling[index].max().dataSync();
      } else {
        current_P1_Q_val = reward[0];
        current_P2_Q_val = reward[1];
      }

      x.push(state.dataSync());
      p1Label.push(current_P1_Q_val.dataSync());
      p2Label.push(current_P2_Q_val.dataSync());
    });

    // Clean unused tensors
    p1Preds.forEach((state) => state.dispose());
    p2Preds.forEach((state) => state.dispose());
    p1FortuneTelling.forEach((state) => state.dispose());
    p2FortuneTelling.forEach((state) => state.dispose());

    // Reshape the batches to be fed to the network
    x = tf
      .tensor(x)
      .reshape([this.model.batchSize, CANVAS_HEIGHT * CANVAS_WIDTH]);
    p1Label = tf.tensor2d(p1Label, [p1Label.length, this.model.numActions]);
    p2Label = tf.tensor2d(p2Label, [p2Label.length, this.model.numActions]);

    // Learn the Q(s, a) values given associated discounted rewards
    await this.p1Model.train(x, p1Label);
    await this.p2Model.train(x, p2Label);

    x.dispose();
    p1Label.dispose();
    p2Label.dispose();
  }
}
