import { P1_STARTING_POS } from "../game/literals";
import { Player } from "../game/player";
import { Standard_Color } from "../game/types";
import { calculateReward } from "./model_functions";

describe("Model Functions", () => {
  let player1: Player;

  beforeEach(() => {
    player1 = new Player({
      name: "p1",
      color: Standard_Color.RED,
      position: P1_STARTING_POS,
    });
  });

  describe("calculateReward", () => {
    it("calculates correctly for a logRewardParam of 1", () => {
      const currentStep = 1;
      const logRewardParam = 1;
      const expectedReward = Math.log(currentStep + 1);
      const actualReward = calculateReward(
        player1,
        currentStep,
        logRewardParam
      );
      expect(actualReward).toEqual(expectedReward);
    });

    it("calculates correctly for a logRewardParam of 2", () => {
      const currentStep = 1;
      const logRewardParam = 2;
      const expectedReward = logRewardParam * Math.log(currentStep + 1);
      const actualReward = calculateReward(
        player1,
        currentStep,
        logRewardParam
      );
      expect(actualReward).toEqual(expectedReward);
    });

    it("Returns negative reward when player is not alive", () => {
      const currentStep = 1;
      const logRewardParam = 2;
      const expectedReward = -1000;
      player1.alive = false;
      const actualReward = calculateReward(
        player1,
        currentStep,
        logRewardParam
      );
      expect(actualReward).toEqual(expectedReward);
    });
  });
});
