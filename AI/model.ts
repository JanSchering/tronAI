import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../game/literals";
import * as tf from "@tensorflow/tfjs";
import { Rank } from "@tensorflow/tfjs";

export class Model {
  batchSize: number;
  numActions: number;
  network: tf.Sequential;

  constructor(batchSize: number) {
    this.numActions = 4;
    this.batchSize = batchSize;
    this.defineModel();
  }

  predict(states: any) {
    return tf.tidy(() => this.network.predict(states));
  }

  /**
   * @param xBatch - The batch of input states.
   * @param yBatch - The batch of labels.
   */
  async train(xBatch: tf.Tensor[], yBatch: tf.Tensor[]) {
    await this.network.fit(xBatch, yBatch);
  }

  //TODO: Maybe the actions should use the enum instead of numbers?
  /**
   * @description choose an action for the agent for the current state of the environment.
   * @param state - The current state of the environment.
   * @param eps - The exploration parameter epsilon.
   * @returns {number} The action as a numeric.
   */
  chooseAction(state: tf.Tensor, eps: number) {
    if (Math.random() < eps) {
      return Math.floor(Math.random() * this.numActions) - 1;
    } else {
      return tf.tidy(() => {
        const logits = <tf.Tensor<tf.Rank>>this.network.predict(state);
        const sigmoid = tf.sigmoid(logits);
        const probs = tf.div(sigmoid, tf.sum(sigmoid));
        return tf.multinomial(<Rank>(<unknown>probs), 1).dataSync()[0];
      });
    }
  }

  defineModel() {
    this.network = tf.sequential();

    const CELL_WIDTH = CANVAS_WIDTH / 5;
    const CELL_HEIGHT = CANVAS_HEIGHT / 5;

    // First layer must have an input shape defined.
    this.network.add(
      tf.layers.dense({ units: 32, inputShape: [CELL_WIDTH * CELL_HEIGHT] })
    );
    // Afterwards, TF.js does automatic shape inference.
    this.network.add(tf.layers.dense({ units: 4 }));

    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam();
    this.network.compile({
      optimizer: optimizer,
      loss: "meanSquaredError",
      metrics: ["accuracy"],
    });
  }
}
