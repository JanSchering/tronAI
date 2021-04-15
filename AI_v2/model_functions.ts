import * as tf from "@tensorflow/tfjs";
import { Player } from "../game/player";
import { NUM_ACTIONS } from "./model_constants";
import { Memory } from "./model_memory";

/**
 * @description let a model pick an action to take for the provided state of the environment.
 * @param model - The Model to make predictions with.
 * @param state - The state of the environment to make predictions for.
 * @param epsilon - The exploration parameter.
 * @returns
 */
const chooseAction = (
  model: tf.Sequential,
  state: tf.Tensor1D,
  epsilon: number
): number => {
  //We want to be able to explore other actions:
  //For that purpose we generate a random number between 0 and 1,
  //If that number is lower than our exploration parameter,
  //We choose a random action instead of using our prediction
  if (Math.random() < epsilon) {
    return getRandomInt(NUM_ACTIONS);
  } else {
    const prediction = model.predict(state);
    const generated_choice = tf.multinomial(<any>prediction, 1).arraySync()[0];
    return <number>generated_choice;
  }
};

/**
 * @description Helper-Function: Gets a random Integer in the range of the provided number
 * @param max - The range.
 */
const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

/**
 * @description Allows the model to replay the game saved in the Memory Object and learn from it.
 * @param props - The metadata about the last game.
 */
const replayExperience = (props: TrainingProps) => {
  //We want to implement deep Q-learning in here.

  const { model_memory, model, discountFactor } = props;

  // First we need a batch of examples from the last game.
  // For now we are going with a standard batch size of 32.
  const batch: Memory = sampleFromMemory(model_memory, 32);
};

/**
 * @description Randomly takes a batch of samples out of the memory.
 * @param memory - The memory to sample from.
 */
const sampleFromMemory = (memory: Memory, samplesize: number) => {
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

type TrainingProps = {
  model: tf.Sequential;
  model_memory: Memory;
  discountFactor: number;
};
