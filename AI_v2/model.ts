import * as tf from "@tensorflow/tfjs";
import { softmax } from "@tensorflow/tfjs";
import {
  NUM_INPUTS,
  LAYER_1_UNITS,
  LAYER_2_UNITS,
  LAYER_3_UNITS,
  LAYER_4_UNITS,
  NUM_OUTPUTS,
} from "./model_constants";

/**
 * @description Creates a tensorflow model.
 * @returns A tensorflow neural network.
 */
export const createModel = (): tf.Sequential => {
  const model = tf.sequential();

  //First hidden Layer, which also defines the input shape of the model
  model.add(
    tf.layers.dense({
      units: LAYER_1_UNITS,
      inputShape: [NUM_INPUTS],
      activation: "relu",
    })
  );

  // Second hidden Layer
  model.add(tf.layers.dense({ units: LAYER_2_UNITS, activation: "relu" }));

  // Third hidden Layer
  model.add(tf.layers.dense({ units: LAYER_3_UNITS, activation: "relu" }));

  // Fourth hidden Layer
  model.add(tf.layers.dense({ units: LAYER_4_UNITS, activation: "relu" }));

  // Defining the output Layer of the model
  model.add(tf.layers.dense({ units: NUM_OUTPUTS, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: "sparseCategoricalCrossentropy",
    metrics: "accuracy",
  });

  return model;
};
