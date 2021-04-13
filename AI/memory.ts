import { sampleSize } from "lodash";

export class Memory {
  maxMemory: number;
  samples: any[];
  /**
   * @param maxMemory - The max amount of memory.
   */
  constructor(maxMemory: number) {
    this.maxMemory = maxMemory;
    this.samples = new Array();
  }

  /**
   * @param {Array} sample - The sample to add to memory.
   */
  addSample(sample: any) {
    this.samples.push(sample);
    if (this.samples.length > this.maxMemory) {
      let [state, , , nextState] = this.samples.shift();
      state.dispose();
      if (nextState) nextState.dispose();
    }
  }

  /**
   * @param nSamples - the amount of samples.
   * @returns {Array} Randomly selected samples.
   */
  sample(nSamples: number) {
    return sampleSize(this.samples, nSamples);
  }
}
