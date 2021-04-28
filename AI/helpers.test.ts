import { getRandomInt } from "./helpers";

describe("AI helper functions", () => {
  describe("getRandomInt", () => {
    it("returns an Integer in the range of the given number", () => {
      for (let i = 0; i < 10; i++) {
        const randomInt = getRandomInt(2);
        expect(randomInt % 1).toBe(0);
        expect(randomInt === 0 || randomInt === 1).toBeTruthy();
      }
    });
  });
});
