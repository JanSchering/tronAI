import { Player } from "./player";
import * as Literals from "./literals";

const STD_NAME = "test";
const STD_COLOR = "red";
const STD_X_POS = 20;
const STD_Y_POS = 30;

/**
 * @param {PlayerConstructor|undefined} vals
 */
let generateConstructorParams = (vals = {}) => {
  return {
    name: vals.name || STD_NAME,
    color: vals.color || STD_COLOR,
    x_pos: vals.x_pos || STD_X_POS,
    y_pos: vals.y_pos || STD_Y_POS,
    direction: vals.direction,
    score: vals.score,
    alive: vals.alive,
  };
};

describe("Player Class", () => {
  describe("instantiation", () => {
    it("instantiates properly", () => {
      const params = generateConstructorParams();
      const newPlayer = new Player(params);
      expect(newPlayer.name).toBe(params.name);
      expect(newPlayer.color).toBe(params.color);
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);
      //The constructor should set standard values
      //for the direction, the score and the alive status
      expect(newPlayer.direction).toBe(Literals.DIRECTIONS.NONE);
      expect(newPlayer.score).toBe(0);
      expect(newPlayer.alive).toBe(true);
    });
  });

  describe("movePlayer", () => {
    it("Doesn't Move when no direction is set", () => {
      const params = generateConstructorParams();
      const newPlayer = new Player(params);
      //Confirm initial position
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);

      newPlayer.movePlayer();

      //Confirm that the position did not change
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);
    });

    it("Direction == 'LEFT' adjusts the position properly", () => {
      const params = generateConstructorParams();
      const newPlayer = new Player(params);
      //Confirm initial position
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);

      newPlayer.setDirection(Literals.DIRECTIONS.LEFT); // Set the direction
      newPlayer.movePlayer();

      //Confirm that the position did not change
      expect(newPlayer.x_pos).toBe(params.x_pos - Literals.PLAYER_WIDTH);
      expect(newPlayer.y_pos).toBe(params.y_pos);
    });

    it("Direction == 'RIGHT' adjusts the position properly", () => {
      const params = generateConstructorParams();
      const newPlayer = new Player(params);
      //Confirm initial position
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);

      newPlayer.setDirection(Literals.DIRECTIONS.RIGHT); // Set the direction
      newPlayer.movePlayer();

      //Confirm that the position did not change
      expect(newPlayer.x_pos).toBe(params.x_pos + Literals.PLAYER_WIDTH);
      expect(newPlayer.y_pos).toBe(params.y_pos);
    });

    it("Direction == 'UP' adjusts the position properly", () => {
      const params = generateConstructorParams();
      const newPlayer = new Player(params);
      //Confirm initial position
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);

      newPlayer.setDirection(Literals.DIRECTIONS.UP); // Set the direction
      newPlayer.movePlayer();

      //Confirm that the position did not change
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos - Literals.PLAYER_HEIGHT);
    });

    it("Direction == 'DOWN' adjusts the position properly", () => {
      const params = generateConstructorParams();
      const newPlayer = new Player(params);
      //Confirm initial position
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos);

      newPlayer.setDirection(Literals.DIRECTIONS.DOWN); // Set the direction
      newPlayer.movePlayer();

      //Confirm that the position did not change
      expect(newPlayer.x_pos).toBe(params.x_pos);
      expect(newPlayer.y_pos).toBe(params.y_pos + Literals.PLAYER_HEIGHT);
    });
  });
});
