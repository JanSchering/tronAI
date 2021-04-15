import * as tf from "@tensorflow/tfjs";

type MemoryObject = {
  state: tf.Tensor1D;
  action: number;
  reward: number;
  nextState: tf.Tensor1D;
};

/**
 * @description We want to be able to keep memory of the last game we played.
 * This way, after a training game is finished the model can replay it and improve its parameters
 * based on the predictions it made and the actual results.
 */
export type Memory = Array<MemoryObject>;
