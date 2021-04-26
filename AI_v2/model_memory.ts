import * as tf from "@tensorflow/tfjs";
import { getRandomInt } from "./utils";

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

/**
 * @description Randomly takes a batch of samples out of the memory.
 * @param memory - The memory to sample from.
 */
export const sampleFromMemory = (memory: Memory, samplesize: number) => {
  // Getting the total number of samples in Memory
  const totalSampleSize: number = memory.length;

  // If theres less samples in Memory than asked for, we just return the whole Memory
  if (totalSampleSize <= samplesize) {
    return memory;
  }

  // Building up a batch of random samples.
  const batch: Memory = [];
  for (let i = 0; i < samplesize; i++) {
    batch.push(memory[getRandomInt(totalSampleSize)]);
  }

  return batch;
};
