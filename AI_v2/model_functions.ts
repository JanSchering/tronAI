import * as tf from "@tensorflow/tfjs";
import { NUM_ACTIONS } from "./model_constants";

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
) => {
  //We want to be able to explore other actions:
  //For that purpose we generate a random number between 0 and 1,
  //If that number is lower than our exploration parameter,
  //We choose a random action instead of using our prediction
  if (Math.random() < epsilon) {
    return getRandomInt(NUM_ACTIONS);
  } else {
    const prediction = model.predict(state);
    const generated_choice = tf.multinomial(<any>prediction, 1).arraySync()[0];
    return generated_choice;
  }
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
