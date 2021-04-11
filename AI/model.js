import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../game/literals";

export class Model {
  constructor(batchSize) {
    this.numActions = 4;
    this.batchSize = batchSize;
    this.defineModel();
  }

  predict(states) {
    return tf.tidy(() => this.network.predict(states));
  }

  /**
   * @param {tf.Tensor[]} xBatch
   * @param {tf.Tensor[]} yBatch
   */
  async train(xBatch, yBatch) {
    await this.network.fit(xBatch, yBatch);
  }

  chooseAction(state, eps) {
    return tf.tidy(() => {
      const logits = this.network.predict(state);
      const sigmoid = tf.sigmoid(logits);
      const probs = tf.div(sigmoid, tf.sum(sigmoid));
      return tf.multinomial(probs, 1).dataSync()[0];
    });
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
