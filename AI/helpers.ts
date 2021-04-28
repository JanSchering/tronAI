/**
 * @description Helper-Function: Gets a random Integer in the range of the provided number
 * @param max - The range.
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};
