import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { Player } from "../game/player";
import { Direction } from "../game/types";
import { NUM_ACTIONS, NUM_INPUTS, NUM_OUTPUTS } from "./model_constants";
import { Memory, sampleFromMemory } from "./model_memory";
import { getRandomInt } from "./helpers";

/**
 * @description let a model pick an action to take for the provided state of the environment.
 * @param model - The Model to make predictions with.
 * @param state - The state of the environment to make predictions for.
 * @param epsilon - The exploration parameter.
 * @returns
 */
export const chooseAction = (
  model: tf.Sequential,
  state: tf.Tensor1D,
  epsilon: number
): Direction => {
  //We want to be able to explore other actions:
  //For that purpose we generate a random number between 0 and 1,
  //If that number is lower than our exploration parameter,
  //We choose a random action instead of using our prediction
  if (Math.random() < epsilon) {
    return getRandomInt(NUM_ACTIONS);
  } else {
    const prediction = model.predict(state);
    const generated_choice = <number>(
      tf.multinomial(<any>prediction, 1).arraySync()[0]
    );

    //TODO: Is there a cleaner way to do this?? Need to parse the enum double
    let direction = <string>Direction[generated_choice];
    return (Direction[direction as any] as any) as Direction;
  }
};

/**
 * @description Allows the model to replay the game saved in the Memory Object and learn from it.
 * @param props - The metadata about the last game.
 */
export const replayExperience = async (props: TrainingProps) => {
  //We want to implement deep Q-learning in here.

  const { model_memory, model, discountFactor } = props;

  // First we need a batch of examples from the last game.
  // For now we are going with a standard batch size of 32.
  const batch: Memory = sampleFromMemory(model_memory, 32);

  // We create arrays to gather the input-states and calculated labels/outputs,
  // So that we can fit the model parameters to the collected data.
  let x: Array<Array<number>> = [];
  let y: Array<Array<number>> = [];

  /*
   * For each Sample in the batch, we want to update the Q-Values:
   * The Q value can be calculated by comparing the predctions of the
   * model for a given state with the actual reward received.
   *
   * To take future rewards into account, we also look at the next state and the predicted
   * rewards. This gets weighted by the discount
   * factor, as these predictions hold uncertainty and shouldnt't hold the same weight as the
   * immediate received reward.
   */
  batch.forEach((sample) => {
    const { state, nextState, action, reward } = sample;
    // We let the model predict the rewards of the current state.
    const current_Q: any = model.predict(state);

    // We also let the model predict the rewards for the next state, if there was a next state in the game.
    let future_reward = tf.zeros([NUM_ACTIONS]);
    if (nextState) {
      future_reward = <Tensor>model.predict(nextState);
    }

    /*
     * We now make use of the fact, that for this particular state, we were able to observe the actually
     * observe what happens, when the model chooses one of the options. We saved what option the model chose in the game
     * and what happened afterwards. We can update the Q-Value for that particular combination of state and action.
     * To approximate the future reward that this course of action generates, we add the highest prediction of the next state.
     */
    current_Q[action] =
      reward + discountFactor * future_reward.max().dataSync()[0];

    // We can now push the state to the input collector
    x.push(Array.from(state.dataSync()));
    // For the labels/outputs, we push the updated Q values
    y.push(Array.from(current_Q.dataSync()));

    // at the end we have to take care of disposing of the created Tensors
    current_Q.dispose();
    future_reward.dispose();
  });

  /*
   * Having updated the Q-Values and gathered all input/output pairs of the batch,
   * We can reshape the collectors and prepare them for training the model.
   */
  const inputs = tf.tensor2d(x, [x.length, NUM_INPUTS]);
  const labels = tf.tensor2d(y, [y.length, NUM_OUTPUTS]);

  // Use the inputs and labels to train the model
  await model.trainOnBatch(inputs, labels);

  inputs.dispose();
  labels.dispose();
};

/**
 * @description Calculates the reward to give a player based on his status, the current step
 * and a parameter to control the logarithmic reward curve.
 * Assumes the steps are counted from 0.
 * @param player - The player to calculate the reward for.
 * @param currentStep - The number of the current step of the game.
 * @param logRewardParam - Controls the logarithmic reward curve.
 * @returns The reward for a player.
 */
export const calculateReward = (
  player: Player,
  currentStep: number,
  logRewardParam: number
): number => {
  return player.alive ? logRewardParam * Math.log(currentStep + 1) : -1000;
};

type TrainingProps = {
  model: tf.Sequential;
  model_memory: Memory;
  discountFactor: number;
};
